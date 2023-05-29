#! /usr/bin/env bash

alembic upgrade head

python /src/src/initial_data.py
