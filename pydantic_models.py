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

Light_Post_Frontmatter = pydantic_model_creator(
    Post,
    exclude=("content", "series"),
)

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

class TagCreateRequest(Request):
    name: str

class SeriesCreateRequest(Request):
    name: str
    description: str
    thumbnail: str | None
    posts: list[int] | None
    tags: list[int] | None
    hidden: bool

class ResultBoolResponse(Response):
    result: bool
