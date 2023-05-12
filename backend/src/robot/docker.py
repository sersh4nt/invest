from datetime import datetime

import docker
from docker.models.containers import Container

from src.config import settings

client = docker.DockerClient(settings.DOCKER_URI)


def create_container(image: str, name: str, env: dict, *args, **kwargs) -> Container:
    return client.containers.create(
        image, name=name, environment=env, detach=True, *args, **kwargs
    )


def start_container(container: str | Container):
    if isinstance(container, str):
        container = client.containers.get(container)
    container.start()
    return container.status


def get_status(container: str | Container) -> str:
    if isinstance(container, str):
        container = client.containers.get(container)
    return container.status


def get_logs(container: str | Container, logs_since: datetime | None = None) -> bytes:
    if isinstance(container, str):
        container = client.containers.get(container)
    logs_kwargs = {"timestamps": True}
    if logs_since is not None:
        logs_kwargs["since"] = logs_since
    return container.logs(**logs_kwargs)
