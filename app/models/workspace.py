from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .joins import users_in_workspace


class Workspace(db.Model):
    __tablename__ = 'workspaces'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    channels = db.relationship("Channel", back_populates="workspace")
    owner = db.relationship(
        "User", back_populates="owned_workspaces", foreign_keys=[owner_id])
    users = db.relationship(
        "User", secondary=users_in_workspace, back_populates="subscribed_workspaces")
