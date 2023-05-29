#!/usr/bin/env bash

set -e

DEFAULT_MODULE_NAME=src.main

MODULE_NAME=${MODULE_NAME:-$DEFAULT_MODULE_NAME}
VARIABLE_NAME=${VARIABLE_NAME:-app}
export APP_MODULE=${APP_MODULE:-"$MODULE_NAME:$VARIABLE_NAME"}

HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}
LOG_LEVEL=${LOG_LEVEL:-info}
LOG_CONFIG=${LOG_CONFIG:-/src/logging.ini}

# run prestart script
PRESTART_SCRIPT_PATH=${PRESTART_PATH:-"prestart.sh"}
. $PRESTART_SCRIPT_PATH

# Start Uvicorn with live reload
exec uvicorn --proxy-headers --host $HOST --port $PORT --log-config $LOG_CONFIG "$APP_MODULE"
