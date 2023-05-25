import json
import random
import time
import uuid

import docker
import docker.errors
from docker.models.containers import Container
from docker.models.networks import Network
from docker.models.volumes import Volume
from pydantic import parse_obj_as
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.account.models import Account
from src.backtest.schemas import BacktestCreate
from src.config import settings
from src.db.session import get_sync_session
from src.robot.models import Robot

client = docker.DockerClient(settings.DOCKER_URI)


class BackTestStrategyFlow:
    def __init__(self, data: dict, user_id: str) -> None:
        self.data = parse_obj_as(BacktestCreate, data)
        self.user_id = user_id

    def _get_token(self, session: Session):
        tokens = session.scalars(
            select(Account.token).filter(Account.user_id == self.user_id)
        ).all()
        return random.choice([*tokens, settings.TINKOFF_TOKEN])

    def _get_image(self, session: Session):
        robot = session.get(Robot, self.data.robot_id)
        return robot.image

    def run(self, *args, **kwargs):
        uid = str(uuid.uuid4())
        session = next(get_sync_session())
        token = self._get_token(session)
        image = self._get_image(session)

        try:
            cache_volume: Volume = client.volumes.get("broker-cache")
        except docker.errors.NotFound:
            print("Cache volume not found, creating one...")
            cache_volume: Volume = client.volumes.create("broker-cache", driver="local")

        try:
            backtest_volume: Volume = client.volumes.get("backtest-results")
        except docker.errors.NotFound:
            print("Results volume not found, creating one...")
            backtest_volume: Volume = client.volumes.create(
                "backtest-results", driver="local"
            )

        network: Network = client.networks.create(f"network_{uid}", driver="bridge")
        print(f"Created network with name={network.name}")

        broker_container: Container = client.containers.run(
            image="vitalets/tinkoff-local-broker",
            network=network.name,
            name=f"broker_{uid}",
            volumes=[f"{cache_volume.name}:/app/.cache"],
            detach=True,
            remove=True,
        )
        print(f"Created broker container={broker_container.short_id}")

        cfg = self.data.json(exclude_unset=True, exclude={"robot_id", "robot_config"})
        env = {
            "TOKEN": token,
            "ACCOUNT_ID": "TEST",
            "INSTRUMENTS": f"[{json.dumps(self.data.robot_config)}]",
            "TEST_CONFIG": cfg,
            "BROKER_URL": f"{broker_container.name}:8080",
            "UUID": uid,
        }

        time.sleep(10)
        t1 = time.time()
        print("Start backtest...")
        client.containers.run(
            image=image,
            network=network.name,
            name=f"worker_{uid}",
            environment=env,
            # remove=True,
            command=["python", "-m", "test"],
            volumes=[f"{backtest_volume.name}:/src/results"],
        )
        print("Backtest finished!")
        t2 = time.time()

        print(f"Time elapsed: {t2-t1:.2f} seconds, cleaning up...")
        broker_container.stop()
        network.remove()
        print("Done!")
