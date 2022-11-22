from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .joins import users_in_channel


class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    workspace_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("workspaces.id")), nullable=False)
    description = db.Column(db.String(250))
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    owner = db.relationship(
        "User", back_populates="owned_channels", foreign_keys=[owner_id])
    users = db.relationship(
        "User", secondary=users_in_channel, back_populates="subscribed_channels")

    workspace = db.relationship("Workspace", back_populates="channels")
    messages = db.relationship("ChannelMessages", back_populates="channel")
