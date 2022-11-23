from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class ChannelMessages(db.Model):
    __tablename__ = 'ChannelMessages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("channels.id")), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    edited = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    sender = db.relationship("User", back_populates="channel_messages")
    channel = db.relationship("Channel", back_populates="messages")

    def to_dict(self):
        return {'id': self.id, 'senderId': self.sender_id, 'channelId': self.channel_id, 'content': self.content, 'edited': self.edited, 'createdAt': self.created_at, 'updatedAt': self.updated_at}

    def to_dict_relations(self):
        return {'id': self.id, 'sender': self.sender.to_dict(), 'channel': self.channel.to_dict(), 'content': self.content, 'edited': self.edited, 'createdAt': self.created_at, 'updatedAt': self.updated_at}
