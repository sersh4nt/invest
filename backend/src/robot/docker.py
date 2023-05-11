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
