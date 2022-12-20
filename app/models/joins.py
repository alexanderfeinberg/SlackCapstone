from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import declarative_base

Base = declarative_base()

users_in_workspace = db.Table(
    'UsersInWorkspace',

    db.Column("user_id", db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("workspace_id", db.Integer, db.ForeignKey(
        add_prefix_for_prod("workspaces.id")), primary_key=True)
)


users_in_channel = db.Table(
    'UsersInChannel',

    db.Column("user_id", db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("channel_id", db.Integer, db.ForeignKey(
        add_prefix_for_prod("channels.id")), primary_key=True)
)

users_in_direct_messages = db.Table("UsersInDirectMessages",
                                    db.Column("users_id", db.Integer, db.ForeignKey(
                                        add_prefix_for_prod("users.id")), primary_key=True),
                                    db.Column("direct_message_id", db.Integer, db.ForeignKey(
                                        add_prefix_for_prod("directMessages.id")), primary_key=True)
                                    )

if environment == "production":
    users_in_workspace.schema = SCHEMA
    users_in_channel.schema = SCHEMA
