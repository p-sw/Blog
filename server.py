from fastapi.logger import logger
import sys
import os
from fastapi import FastAPI

logger.info("Initializing FastAPI...")
app = FastAPI()
logger.info("FastAPI App Initialized.")
logger.debug(str(app))

"""
Database Model Load
"""
logger.info("Loading DB Models...")

from db.models import Series, Post, Tag

logger.info("DB Models Loaded.")


"""
FastAPI Initialization
"""
from fastapi import Depends, HTTPException, APIRouter


"""
Request & Response Model Section
"""
from pydantic_models import (
    UserLoginRequest,
    TokenRequest,
    TokenResponse, ResultBoolResponse, SeriesCreateRequest, SingleSeriesResponse
)
from pydantic_models import (
    Light_Post_Frontmatter,
    PostCreateRequest,
    TagCreateRequest,
    SingleTagResponse,
    SinglePostResponse,
)

logger.info("FastAPI Request & Response Initialized.")


"""
Security Initialization Section
"""
from secrets import token_hex
from datetime import timedelta, datetime

ADMIN_ID: str | None = os.environ.get("ADMIN_ID", None)
ADMIN_PW: str | None = os.environ.get("ADMIN_PW", None)

logger.info("Security Initialized.")
# logger.debug(f"ADMIN_ID {ADMIN_ID} | ADMIN_PW {ADMIN_PW}")  # Not recommended to uncomment this
if not (ADMIN_ID and ADMIN_PW):
    logger.warning("ADMIN_ID or ADMIN_PW not provided in environment variable.")
    sys.exit(1)


class AdminSession:
    def __init__(self):
        self.token: str = token_hex(50)
        self.expire: timedelta = timedelta(days=7)
        self.created: datetime = datetime.now()
        logger.info(f"AdminSession Created at {self.created}")

    async def is_expired(self) -> bool:
        if self.created + self.expire < datetime.now():
            return True
        return False

    async def refresh(self) -> None:
        self.token = token_hex(50)
        self.created = datetime.now()
        logger.info(f"AdminSession refreshed at {self.created}")

    async def serialize(self) -> TokenResponse:
        return TokenResponse(
            token=self.token
        )


ADMIN_SESSION: AdminSession | None = None


"""
Security Route Section
"""
from fastapi import Query

@app.post("/login", response_model=TokenResponse)
async def login(form_data: UserLoginRequest):
    global ADMIN_SESSION

    if not (form_data.username and form_data.password):
        raise HTTPException(status_code=400, detail={"error": "Login details not provided."})
    if form_data.username == ADMIN_ID and form_data.password == ADMIN_PW:
        if ADMIN_SESSION is None:
            ADMIN_SESSION = AdminSession()
        if await ADMIN_SESSION.is_expired():
            await ADMIN_SESSION.refresh()
        return await ADMIN_SESSION.serialize()
    raise HTTPException(status_code=401, detail={"error": "Invalid login details."})

@app.post("/validate")
async def validate(body: TokenRequest):
    global ADMIN_SESSION

    if ADMIN_SESSION is not None and body.token == ADMIN_SESSION.token and not await ADMIN_SESSION.is_expired():
        return {"status": "ok"}
    raise HTTPException(status_code=401, detail={"error": "Invalid token."})

@app.post("/logout")
async def logout(body: TokenRequest):
    global ADMIN_SESSION

    if ADMIN_SESSION is not None and body.token == ADMIN_SESSION.token and not await ADMIN_SESSION.is_expired():
        ADMIN_SESSION = None
        return {"status": "ok"}
    raise HTTPException(status_code=401, detail={"error": "Invalid token."})

logger.info("Security Route Ready.")


"""
Dependency Section
"""
from fastapi import Header

async def admin_session(token: str = Header(...)):
    global ADMIN_SESSION

    if ADMIN_SESSION is not None and token == ADMIN_SESSION.token and not await ADMIN_SESSION.is_expired():
        return ADMIN_SESSION
    raise HTTPException(status_code=401, detail={"error": "Invalid token."})

logger.info("Dependency Initialized.")

"""
Route Section
"""
"""
Admin Section
"""
from typing import List

admin = APIRouter(dependencies=[Depends(admin_session)])

@admin.get("/post", response_model=List[Light_Post_Frontmatter])
async def get_posts(page: int = Query(1)):
    response = await \
        Light_Post_Frontmatter.from_queryset(Post.filter(series=None).order_by("-id").limit(10).offset((page - 1) * 10))
    return response

@admin.post("/post", response_model=Light_Post_Frontmatter)
async def create_post(body: PostCreateRequest):
    post = await Post.create(
        title=body.title,
        content=body.content,
        description=body.description,
        series_id=body.series_id,
        thumbnail=body.thumbnail,
        hidden=body.hidden,
    )
    if body.tag_ids:
        for tag in body.tag_ids:
            await post.tags.add((await Tag.get_or_create(name=tag))[0])
    return await Light_Post_Frontmatter.from_tortoise_orm(post)

@admin.get("/post/unique-title", response_model=ResultBoolResponse)
async def post_unique_title(query: str):
    if await Post.filter(title=query).exists():
        return ResultBoolResponse(result=False)
    return ResultBoolResponse(result=True)

@admin.get("/post/search-by-title", response_model=List[Light_Post_Frontmatter])
async def post_search_by_title(query: str):
    response = await \
        Light_Post_Frontmatter.from_queryset(Post.filter(title__icontains=query).order_by("-id"))
    return response

@admin.get("/tag", response_model=List[SingleTagResponse])
async def get_tags(page: int = Query(1)):
    response = await \
        SingleTagResponse.from_queryset(Tag.all().order_by("-id").limit(10).offset((page - 1) * 10))
    return response

@admin.post("/tag", response_model=SingleTagResponse)
async def create_tag(body: TagCreateRequest):
    tag = await Tag.create(
        name=body.name,
    )
    return tag

@admin.get("/tag/unique-name", response_model=ResultBoolResponse)
async def tag_unique_name(query: str):
    if await Tag.filter(name=query).exists():
        return ResultBoolResponse(result=False)
    return ResultBoolResponse(result=True)

@admin.get("/series", response_model=List[SingleSeriesResponse])
async def get_series(page: int = Query(1)):
    response = await \
        SingleSeriesResponse.from_queryset(Series.all().order_by("-id").limit(10).offset((page - 1) * 10))
    return response

@admin.post("/series", response_model=SingleSeriesResponse)
async def create_series(body: SeriesCreateRequest):
    series = await Series.create(
        name=body.name,
        description=body.description,
        thumbnail=body.thumbnail
    )
    if body.posts:
        for post in body.posts:
            await Post.filter(id=post).update(series=series)
    return series

@admin.get("/series/unique-name", response_model=ResultBoolResponse)
async def series_unique_name(query: str):
    if await Series.filter(name=query).exists():
        return ResultBoolResponse(result=False)
    return ResultBoolResponse(result=True)

logger.info("Admin Route Ready.")
"""
General Section
"""
general = APIRouter()

@general.get("/post/{post_id}", response_model=SinglePostResponse)
async def get_single_post(post_id: int):
    post = await Post.get_or_none(id=post_id)
    if post is None:
        raise HTTPException(status_code=404, detail={"error": "Post not found."})
    return await SinglePostResponse.from_tortoise_orm(post)

@general.get("/post/{post_id}/light", response_model=Light_Post_Frontmatter)
async def get_light_single_post(post_id: int):
    post = await Post.get_or_none(id=post_id)
    if post is None:
        raise HTTPException(status_code=404, detail={"error": "Post not found."})
    return await Light_Post_Frontmatter.from_tortoise_orm(post)

@general.get("/series/{series_id}", response_model=SingleSeriesResponse)
async def get_single_series(series_id: int):
    series = await Series.get_or_none(id=series_id)
    if series is None:
        raise HTTPException(status_code=404, detail={"error": "Series not found."})
    return await SingleSeriesResponse.from_tortoise_orm(series)

@general.get("/series/{series_id}/get-posts", response_model=List[int])
async def get_series_posts(series_id: int):
    series = await Series.get_or_none(id=series_id)
    await series.fetch_related("posts")
    return [post.id for post in series.posts]

@general.get("/tag/{tag_id}", response_model=SingleTagResponse)
async def get_single_tag(tag_id: int):
    tag = await Tag.get_or_none(id=tag_id)
    if tag is None:
        raise HTTPException(status_code=404, detail={"error": "Tag not found."})
    return await SingleTagResponse.from_tortoise_orm(tag)

logger.info("General Route Ready.")
"""
Add Route
"""

app.include_router(admin, prefix="/admin")
app.include_router(general, prefix="/api")
logger.info("Router Added.")

"""
Database Initialization
"""
logger.info("Initializing database...")


"""
Database Engine Section
"""
from tortoise.contrib.fastapi import register_tortoise

register_tortoise(
    app,
    db_url="sqlite://db.sqlite3",
    modules={"models": ["db.models"]},
    generate_schemas=True,  # disable on production | enable on development
    add_exception_handlers=True,
)


logger.info("Database engine initialized.")