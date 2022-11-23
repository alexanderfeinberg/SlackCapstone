from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from .joins import users_in_channel, users_in_workspace
from .workspace import Workspace


class User(db.Model, UserMixin):
    DEFAULT_PROFILE_PICTURE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String(250), nullable=False)
    last_name = db.Column(db.String(250), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(
        db.String(500), default=DEFAULT_PROFILE_PICTURE)
    created_at = db.Column(db.DateTime, default=datetime.now())

    channel_messages = db.relationship(
        "ChannelMessages", back_populates="sender")

    subscribed_channels = db.relationship(
        "Channel", secondary=users_in_channel, back_populates="users")
    owned_channels = db.relationship("Channel", back_populates="owner")
    subscribed_workspaces = db.relationship(
        "Workspace", secondary=users_in_workspace, back_populates="users")
    owned_workspaces = db.relationship("Workspace", back_populates="owner")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def check_unique_workspace_names(self, name):
        existing = list(
            filter(lambda workspace: workspace.name == name, self.owned_workspaces))
        return len(existing) > 0

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'profilePicture': self.profile_picture,
            'createdAt': self.created_at
        }

    def to_dict_relations(self): return {
        'id': self.id,
        'username': self.username,
        'email': self.email,
        'first_name': self.first_name,
        'last_name': self.last_name,
        'profile_picture': self.profile_picture,
        'created_at': self.created_at,
        'channelMessages': [message.to_dict() for message in self.channel_messages],
        'subscribedChannels': [channel.to_dict() for channel in self.subscribed_channels],
        'ownedChannels': [channel.to_dict() for channel in self.owned_channels],
        'subscribedWorkplaces': [workplace.to_dict() for workplace in self.subscribed_workspaces],
        'ownedWorkplaces': [workplace.to_dict() for workplace in self.owned_workspaces]
    }
