from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import User, ChannelMessages, Channel
from ..forms.channel_message_form import ChannelMessageForm
from ..models.db import db
from datetime import datetime


channel_message_router = Blueprint("channel_messages", __name__)

# Edit channel Message


@channel_message_router.route('/<int:message_id>', methods=["PUT"])
@login_required
def edit_channel_message(message_id):
    form = ChannelMessageForm
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        existing_message = ChannelMessages.query.get_or_404(message_id)
        # handle forbidden error here
        existing_message.content = data['content']
        try:
            existing_message.edited = data['edited']
        except KeyError as e:
            pass
        existing_message.updated_at = datetime.now()
        db.session.commit()
        return existing_message.to_dict()

# Delete channel message


@channel_message_router.route('/<int:message_id>', methods=['DELETE'])
@login_required
def delete_message(message_id):
    existing_message = ChannelMessages.query.get_or_404(message_id)
    if existing_message.sender_id != current_user.id:
        # handle  forbidden error here
        pass
    db.session.delete(existing_message)
    db.session.commit()
    return {'message': f'Message {message_id} has successfully been deleted.', 'statusCode': 200}
