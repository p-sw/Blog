from tortoise.models import Model
from tortoise import fields


class Series(Model):
    id = fields.IntField(pk=True)

    posts: fields.ReverseRelation["Post"]

    name = fields.CharField(max_length=255, unique=True, index=True)
    description = fields.TextField()
    thumbnail = fields.CharField(max_length=255, null=True)

    created_at = fields.DatetimeField(index=True, auto_now_add=True)
    updated_at = fields.DatetimeField(index=True, auto_now=True)

    hidden = fields.BooleanField(default=False)

    class Meta:
        table="series"
        ordering=["-created_at"]


class Tag(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=15)

    posts: fields.ReverseRelation["Post"]

    class Meta:
        table="tags"


class Post(Model):
    id = fields.IntField(pk=True)

    series: fields.ForeignKeyRelation[Series] = fields.ForeignKeyField("models.Series", related_name="posts", null=True, on_delete="CASCADE")
    tags: fields.ManyToManyRelation[Tag] = fields.ManyToManyField("models.Tag", related_name="posts", through="post_tags", null=True, on_delete=fields.SET_NULL)

    title = fields.CharField(max_length=255, unique=True, index=True)
    description = fields.TextField()
    content = fields.TextField()
    thumbnail = fields.CharField(max_length=255, null=True)

    created_at = fields.DatetimeField(auto_now_add=True)
    edited_at = fields.DatetimeField(auto_now=True)
    views = fields.IntField(default=0)
    hidden = fields.BooleanField(default=False)

    class Meta:
        table="posts"
        ordering = ["-created_at"]
