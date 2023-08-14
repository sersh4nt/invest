#! /usr/bin/env bash

export WORKER_CLASS=${WORKER_CLASS:-"uvicorn.workers.UvicornWorker"}

PRESTART_PATH=${PRESTART_PATH:-/src/cmd/prestart.sh}
echo "Checking for script in $PRESTART_PATH"
if [ -f $PRESTART_PATH ] ; then
    echo "Running script $PRESTART_PATH"
    . "$PRESTART_PATH"
else
    echo "There is not script in $PRESTART_PATH"
fi

exec gunicorn -w 4 -k "$WORKER_CLASS" -b "0.0.0.0:8000" "src.main:app"
