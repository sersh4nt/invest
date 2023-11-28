init:
	poetry lock --no-update
	poetry install --no-interaction --no-root --no-ansi

init-test: init
	poetry install --no-interaction --no-root --no-ansi --only test

init-lint: init
	poetry install --no-interaction --no-root --no-ansi --only lint

format: init-lint
	black .
	ruff check --fix .

lint-ruff: init-lint
	ruff check .

lint-mypy: init-lint
	mypy .

lint: format init-lint lint-ruff lint-mypy

test: init-test
	sh -c 'poetry run pytest || ([ $$? = 5 ] && exit 0 || exit $$?)'
