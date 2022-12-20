from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.dialects.postgresql import ENUM


class Messages(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.Integer, nullable=False)
    source_type = db.Column(
        ENUM('channel', 'directMessage', 'groupMessage'), nullable=False)

    sender_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    edited = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    sender = db.relationship("User", back_populates="messages")
    channel = db.relationship(
        "Channel", primaryjoin="and_(Messages.source_type=='channel', foreign(Messages.source_id)==Channel.id)", uselist=False)
    direct_message_chat = db.relationship(
        "DirectMessage", primaryjoin="and_(Messages.source_type=='directMessages', foreign(Messages.source_id)==DirectMessage.id)", uselist=False)

    def to_dict(self):
        print("STRFTIME ", self.updated_at.strftime('%m/%d/%Y'))
        return {'id': self.id, 'senderId': self.sender_id, 'sender': self.sender.to_dict(), 'sourceId': self.source_id, 'sourceType': self.source_type, 'content': self.content, 'edited': self.edited, 'createdAt': self.created_at.strftime('%m/%d/%Y, %H%M%S'), 'updatedAt': self.updated_at.strftime('%m/%d/%Y, %H%M%S')}

    def to_dict_relations(self):
        return {'id': self.id, 'sender': self.sender.to_dict(), 'channel': self.channel.to_dict(), 'content': self.content, 'edited': self.edited, 'createdAt': self.created_at.strftime('%m/%d/%Y, %H%M%S'), 'updatedAt': self.updated_at.strftime('%m/%d/%Y, %H%M%S')}
