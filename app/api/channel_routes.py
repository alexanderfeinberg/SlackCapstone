from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import User, ChannelMessages, Channel
from ..forms.channel_message_form import ChannelMessageForm
from ..forms.add_user_form import AddUserForm
from ..forms.channel_form import ChannelForm
from ..models.db import db
from datetime import datetime
from .helpers import get_current_user

channel_router = Blueprint("channels", __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field}:{error}')
    return errorMessages


# Get all channels


@channel_router.route('/')
def get_all_channels():
    channels = Channel.query.all()
    if not channels:
        return jsonify([])
    return jsonify({"Channels": [channel.to_dict() for channel in channels]})


# Get channel by id
@channel_router.route('/<int:channel_id>')
def get_channel_by_id(channel_id):
    channel = Channel.query.get_or_404(channel_id)
    return jsonify({"Channel": channel.to_dict(user_id=current_user.id, owner=True)})

# Delete channel


@channel_router.route('/<int:channel_id>', methods=["DELETE"])
@login_required
def delete_channel(channel_id):
    print("STARTINGGGG")
    channel = Channel.query.get_or_404(channel_id)
    if channel.owner_id != current_user.id:
        # Handle forbidden error here
        pass

    print("CHANNELLLLLLL ", channel)

    db.session.delete(channel)
    db.session.commit()
    return {"message": f'Channel {channel_id} has been deleted', 'statusCode': 200}


# Edit Channel
@channel_router.route('/<int:channel_id>', methods=["PUT"])
@login_required
def edit_channel(channel_id):
    channel = Channel.query.get_or_404(channel_id)
    if channel.owner_id != current_user.id:
        # Handle forbidden error here
        pass
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel.name = form.data['name']
        try:
            channel.description = form.data['description']
        except KeyError as e:
            pass
        channel.updated_at = datetime.now()
        db.session.commit()
        return jsonify({"Channel": channel.to_dict()})
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# Get users from channel


@channel_router.route('/<int:channel_id>/users')
def get_users_in_channel(channel_id):
    channel = Channel.query.get_or_404(channel_id)
    return jsonify({"Users": [user.to_dict() for user in channel.users]})

# Add user to channel


@channel_router.route('/<int:channel_id>/users', methods=['POST'])
@login_required
def add_user_to_channel(channel_id):
    form = AddUserForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel = Channel.query.get_or_404(channel_id)
        user = User.query.get_or_404(form.data['user_id'])
        res = channel.add_user(user)
        channel.users = res.users
        db.session.commit()
        return jsonify({"Channel": channel.to_dict(user_id=current_user.id)})

    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# Remove current user from channel


@channel_router.route('/<int:channel_id>/users', methods=["DELETE"])
@login_required
def remove_user_from_channel(channel_id):
    channel = Channel.query.get_or_404(channel_id)
    curr_user = get_current_user(current_user.id)
    res = channel.remove_user(curr_user)
    channel.users = res.users
    db.session.commit()
    return jsonify({"Channel": channel.to_dict(user_id=current_user.id)})


# Add channel message
@channel_router.route('/<int:channel_id>/messages', methods=["POST"])
@login_required
def add_message(channel_id):
    form = ChannelMessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel = Channel.query.get_or_404(channel_id)
        new_mesage = ChannelMessages(content=form.data['content'], edited=form.data['edited'], sender=get_current_user(
            current_user.id), channel=channel)
        db.session.add(new_mesage)
        db.session.commit()
        return jsonify({"Message": new_mesage.to_dict()})
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# Get channel messages


@channel_router.route('/<int:channel_id>/messages')
def get_channel_messages(channel_id):
    channel = Channel.query.get_or_404(channel_id)
    if not channel.messages:
        return jsonify([])
    return jsonify({"Messages": [message.to_dict() for message in channel.messages]})
