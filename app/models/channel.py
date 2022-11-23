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

    def add_user(self, user):
        if self.has_user(user.id):
            raise Exception("User is already in this channel!")
        self.users.append(user)
        return self

    def has_user(self, userId):
        all_users = [user for user in self.users]
        return len(list(filter(lambda user: user.id == userId, all_users))) > 0

    def remove_user(self, user):
        if self.has_user(user.id):
            self.users.remove(user)
            return self

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'ownerId': self.owner_id, 'workspaceId': self.workspace_id, 'description': self.description,
                'createdAt': self.created_at, 'updatedAt': self.updated_at, 'userCount': len(self.users)}

    def to_dict_relations(self):
        return {'id': self.id, 'name': self.name, 'owner': self.owner.to_dict(), 'users': [user.to_dict() for user in self.users], 'workspace': self.workspace.to_dict(),
                'messages': [message.to_dict() for message in self.messages],
                'description': self.description,
                'createdAt': self.created_at, 'updatedAt': self.updated_at}
