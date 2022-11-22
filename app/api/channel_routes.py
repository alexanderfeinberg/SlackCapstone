from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import User, ChannelMessages, Channel
from ..forms.channel_message_form import ChannelMessageForm
from ..forms.channel_form import ChannelForm
from ..models.db import db
from datetime import datetime

channel_router = Blueprint("channels", __name__)

# Get all channels


@channel_router('/')
def get_all_channels(self):
    channels = Channel.query.all()
    if not channels:
        return jsonify([])
    return jsonify([channel.to_dict_relations() for channel in channels])


# Get channel by id
@channel_router('/<int:channel_id>')
def get_channel_by_id(self, channel_id):
    channel = Channel.query.get_or_404(channel_id)
    return jsonify(channel.to_dict_relations())

# Delete channel


@channel_router('/<int:channel_id>', methods=["DELETE"])
@login_required
def delete_channel(self, channel_id):
    channel = Channel.query.get_or_404(channel_id)
    if channel.owner_id != current_user.id:
        # Handle forbidden error here
        pass

    db.session.delete(channel)
    db.session.commit()
    return {"message": f'Channel {channel_id} has been deleted', 'statusCode': 200}
