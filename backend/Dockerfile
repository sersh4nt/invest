FROM python:3.11-slim

ARG WORK_DIR=/opt/mnt
ENV WORK_DIR=$WORK_DIR
ENV PYTHONPATH=$WORK_DIR

WORKDIR $WORK_DIR

RUN apt-get update && apt-get install --no-install-recommends -y curl 

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python3 && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

COPY ./pyproject.toml ./poetry.lock* ./

ARG INSTALL_DEV=false
RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then poetry install --no-root ; else poetry install --no-root --no-dev ; fi"

COPY ./src ./cmd ./

ARG SCRIPT_LOCATION=$WORK_DIR/cmd/start.sh

CMD ["bash", "$SCRIPT_LOCATION"]
