import functools

from src.exceptions import InvalidTinkoffToken
from tinkoff.invest.exceptions import AioUnauthenticatedError


def tinkoff_validates(func):
    @functools.wraps(func)
    async def wrapped(*args, **kwargs):
        try:
            result = await func(*args, **kwargs)
            return result
        except AioUnauthenticatedError as e:
            raise InvalidTinkoffToken() from e

    return wrapped
