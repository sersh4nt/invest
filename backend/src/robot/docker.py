from datetime import datetime, timezone

import docker
import docker.errors
from docker.models.containers import Container
from src.config import settings

client = docker.DockerClient(settings.DOCKER_URI)


def get_container_by_name(container: str) -> Container | None:
    try:
        return client.containers.get(container)
    except docker.errors.NotFound:
        return None
    except docker.errors.APIError:
        return None


def create_container(image: str, name: str, env: dict, *args, **kwargs) -> Container:
    return client.containers.create(
        image, name=name, environment=env, detach=True, *args, **kwargs
    )


def start_container(container: str | Container):
    if isinstance(container, str):
        container = get_container_by_name(container)
    if container is None:
        return "NOT_FOUND"
    container.start()
    return container.status


def get_status(container: str | Container) -> str:
    if isinstance(container, str):
        container = get_container_by_name(container)
    if container is None:
        return "NOT_FOUND"
    return container.status


def get_logs(container: str | Container, logs_since: datetime | None = None) -> bytes:
    if isinstance(container, str):
        container = get_container_by_name(container)
    if container is None:
        return b""
    logs_kwargs = {"timestamps": True}
    if logs_since is not None:
        if logs_since.tzinfo is not None:
            logs_since = logs_since.replace(tzinfo=None)
        logs_kwargs["since"] = logs_since
    return container.logs(**logs_kwargs)


def start_worker(container: str | Container) -> str:
    if isinstance(container, str):
        container = get_container_by_name(container)
    if container is None:
        return "NOT_FOUND"

    if container.status == "RUNNING":
        return "ALREADY_RUNNING"

    container.start()
    return "STARTED"


def stop_worker(container: str | Container) -> str:
    if isinstance(container, str):
        container = get_container_by_name(container)
    if container is None:
        return "NOT_FOUND"

    if container.status == "CREATED" or container.status == "EXITED":
        return "ALREADY_STOPPED"

    container.stop()
    return "STOPPED"


def restart_worker(container: str | Container) -> str:
    if isinstance(container, str):
        container = get_container_by_name(container)
    if container is None:
        return "NOT_FOUND"

    container.restart()
    return "RESTARTED"
