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
from src.backtest.models import BacktestResult
from src.backtest.schemas import BacktestCreate
from src.config import settings
from src.db.session import get_sync_session
from src.robot.models import Robot

client = docker.DockerClient(settings.DOCKER_URI)


class BackTestStrategyFlow:
    def __init__(self, data: dict, user_id: str, strategy_name: str) -> None:
        self.data = parse_obj_as(BacktestCreate, data)
        self.user_id = user_id
        self.strategy_name = strategy_name
        self.uid = self.data.id or str(uuid.uuid4())

    def _get_token(self, session: Session):
        tokens = session.scalars(
            select(Account.token).filter(Account.user_id == self.user_id)
        ).all()
        return random.choice([*tokens, settings.TINKOFF_TOKEN])

    def _get_image(self, session: Session):
        robot = session.get(Robot, self.data.robot_id)
        return robot.image

    def _prepare_infrastructure(self) -> tuple[Volume, Volume, Network]:
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

        network: Network = client.networks.create(
            f"network_{self.uid}", driver="bridge"
        )
        print(f"Created network with name={network.name}")

        return cache_volume, backtest_volume, network

    def _create_broker_container(self) -> Container:
        broker: Container = client.containers.run(
            image="vitalets/tinkoff-local-broker",
            network=self.network.name,
            name=f"broker_{self.uid}",
            volumes=[f"{self.cache_volume.name}:/app/.cache"],
            detach=True,
            remove=True,
        )
        print(f"Created broker container={broker.short_id}")
        return broker

    def _prepare_env(self, token: str) -> dict:
        instrument_config = {
            "figi": self.data.figi,
            "strategy": {
                "name": self.strategy_name,
                "parameters": self.data.robot_config,
            },
        }

        return {
            "TOKEN": token,
            "ACCOUNT_ID": "TEST",
            "INSTRUMENTS": f"[{json.dumps(instrument_config)}]",
            "TEST_CONFIG": self.data.json(
                exclude_unset=True, exclude={"robot_id", "robot_config", "id"}
            ),
            "BROKER_URL": f"{self.broker_container.name}:8080",
            "UUID": self.uid,
        }

    def _backtest(self, image_name: str, env: dict) -> float:
        time.sleep(10)
        t1 = time.time()
        print("Start backtest...")
        client.containers.run(
            image=image_name,
            network=self.network.name,
            name=f"worker_{self.uid}",
            environment=env,
            remove=True,
            command=["python", "-m", "test"],
            volumes=[f"{self.backtest_volume.name}:/src/results"],
        )
        print("Backtest finished!")
        t2 = time.time()
        time_elapsed = t2 - t1
        print(f"Time elapsed: {time_elapsed:.2f} seconds, cleaning up...")
        return time_elapsed

    def _clean_up(self):
        self.broker_container.stop()
        self.network.remove()

    def _save_results(self, session: Session, time_elapsed: float | None = None):
        print("Done! Saving results...")
        obj = session.get(BacktestResult, self.uid)
        if obj is None:
            return

        obj.is_finished = True
        with open(f"/src/backtest-results/{self.uid}.json", "r") as f:
            results: dict = json.load(f)

        obj.results = results
        obj.absolute_yield = float(results.get("absolute_yield"))
        obj.relative_yield = float(results.get("portfolio", {}).get("yield"))
        obj.time_elapsed = time_elapsed
        session.add(obj)
        session.commit()

    def run(self, *args, **kwargs):
        session = next(get_sync_session())

        obj = session.get(BacktestResult, self.uid)
        if obj is None:
            return

        obj.is_started = True
        session.add(obj)
        session.commit()

        (
            self.cache_volume,
            self.backtest_volume,
            self.network,
        ) = self._prepare_infrastructure()
        self.broker_container = self._create_broker_container()

        token = self._get_token(session)
        image = self._get_image(session)
        env = self._prepare_env(token)
        time_elapsed = self._backtest(image, env)

        self._clean_up()

        self._save_results(session, time_elapsed)
        session.close()
