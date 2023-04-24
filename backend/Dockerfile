FROM python:3.11-slim

RUN apt-get update && \
    apt-get install -y curl gcc libpq-dev && \
    apt clean && \
    rm -rf /var/cache/apt/*

ARG WORK_DIR=/src

ENV WORK_DIR=$WORK_DIR \
    PYTHONPATH=$WORK_DIR \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

WORKDIR $WORK_DIR

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python3 && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

COPY ./pyproject.toml ./poetry.lock* ./

ARG INSTALL_DEV=false
RUN bash -c "if [ $INSTALL_DEV == 'true '] ; then poetry install --no-root ; else poetry install --no-root --no-dev ; fi"

COPY . .
ENV PATH "$PATH:/src/cmd"

RUN useradd -m -d /src -s /bin/bash app \
    && chown -R app:app /src/* && chmod +x /src/cmd/*

USER app

CMD ["./cmd/start-dev.sh"]
