from typing import Generic, List, Optional, TypeVar

from fastapi import Query
from pydantic import BaseModel
from pydantic.generics import GenericModel

Model = TypeVar("Model", bound=BaseModel)


class PaginationOpts:
    def __init__(
        self,
        page: Optional[int] = Query(None, ge=0),
        page_size: Optional[int] = Query(50, ge=1, le=1000),
    ):
        self.page = page
        self.page_size = page_size


class Page(GenericModel, Generic[Model]):
    count: int
    items: List[Model]
    page: int
