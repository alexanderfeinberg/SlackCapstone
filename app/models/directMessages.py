from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from datetime import datetime
from .joins import users_in_direct_messages


class DirectMessage(db.Model):
    __tablename__ = "directMessages"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    workspace_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("workspaces.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    owner = db.relationship(
        "User", back_populates="owned_direct_messages", foreign_keys=[owner_id])

    workspace = db.relationship(
        "Workspace", back_populates="direct_message_chats")

    users = db.relationship(
        "User", secondary=users_in_direct_messages, back_populates="direct_message_chats")

    messages = db.relationship(
        "Messages",  backref=db.backref("direct_message_chat"), primaryjoin="and_(Messages.source_type=='directMessages', foreign(Messages.source_id)==DirectMessage.id)", lazy="dynamic", cascade="all, delete")

    def add_users(self, *args):
        if len(self.users) >= 2:
            raise Exception("Direct Message chat can only have 2 users")

        for user_id in args:
            user = User.query.get(user_id)
            print("CURRENT USERS ", self.users, user)
            if user in self.users:
                raise Exception("User is already in the chat.")
            self.users.append(user)
        return self.users

    def add_messages(self, message):
        self.messages.append(message)
        return self.messages

    def to_dict(self):
        return {"id": self.id, "workspaceId": self.workspace_id, "users": [user.to_dict() for user in self.users], "ownerId": self.owner_id, "type": "directMessage"}
