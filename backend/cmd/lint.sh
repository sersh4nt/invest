#!/bin/sh -e

set -x

autoflake --remove-all-unused-imports --recursive --remove-unused-variables --in-place src tests --exclude=__init__.py
isort src tests --profile black
black src tests
