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

    channels = db.relationship(
        "Channel", back_populates="workspace", cascade="all, delete")
    owner = db.relationship(
        "User", back_populates="owned_workspaces", foreign_keys=[owner_id])
    users = db.relationship(
        "User", secondary=users_in_workspace, back_populates="subscribed_workspaces")

    def add_user(self, user):
        self.users.append(user)
        return self

    def has_user(self, userId):
        return self.users.filter(users_in_workspace.c.user_id == userId).count() > 0

    def remove_user(self, user):
        if self.has_user(user.id):
            self.users.remove(user)
            return self

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'ownerId': self.owner_id, 'url': self.url,
                'createdAt': self.created_at, 'updatedAt': self.updated_at, 'userCount': len(self.users)
                }

    def to_dict_relations(self):
        return {'id': self.id, 'name': self.name, 'owner': self.owner.to_dict(),
                'channels': [channel.to_dict() for channel in self.channels],
                'users': [user.to_dict() for user in self.users], 'url': self.url,
                'createdAt': self.created_at, 'updatedAt': self.updated_at
                }
