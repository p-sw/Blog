from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator
from fastapi import Body
from db.models import Post, Tag, Series


class ORM:
    class Config:
        orm_mode = True

class Request(BaseModel):
    ...

class Response(BaseModel):
    ...

class UserLoginRequest(Request):
    username: str | None = Body(None)
    password: str | None = Body(None)

class TokenRequest(Request):
    token: str

class TokenResponse(Response):
    token: str

SinglePostResponse = pydantic_model_creator(
    Post,
)

SingleTagResponse = pydantic_model_creator(
    Tag
)

SingleSeriesResponse = pydantic_model_creator(
    Series
)

class PostCreateRequest(Request):
    title: str
    description: str
    content: str
    hidden: bool
    thumbnail: str | None
    series_id: int | None
    tags: list[int] | None

class PostUpdateRequest(Request):
    id: int
    title: str | None
    description: str | None
    content: str | None
    hidden: bool | None
    thumbnail: str | None
    series_id: int | None
    tags: list[int] | None

class TagCreateRequest(Request):
    name: str

class TagUpdateRequest(Request):
    id: int
    name: str | None

class SeriesCreateRequest(Request):
    name: str
    description: str
    thumbnail: str | None
    posts: list[int] | None
    tags: list[int] | None
    hidden: bool

class SeriesUpdateRequest(Request):
    id: int
    name: str | None
    description: str | None
    thumbnail: str | None
    posts: list[int] | None
    tags: list[int] | None
    hidden: bool | None

class SeriesIdResponse(Response):
    id: int | None

class PostSearchRequest(Request):
    title: str | None
    tags: list[int] | None

class PostSearchResult(Response):
    posts: list[SinglePostResponse]
    max_page: int

class SeriesSearchRequest(Request):
    name: str | None
    tags: list[int] | None

class SeriesSearchResult(Response):
    series: list[SingleSeriesResponse]
    max_page: int

class TagSearchResult(Response):
    tags: list[SingleTagResponse]
    max_page: int

class ResultBoolResponse(Response):
    result: bool
