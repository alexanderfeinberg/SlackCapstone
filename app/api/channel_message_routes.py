from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import User, Messages, Channel
from ..forms.channel_message_form import ChannelMessageForm
from ..models.db import db
from datetime import datetime


channel_message_router = Blueprint("channel_messages", __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field}:{error}')
    return errorMessages


# Get all channel messages


@channel_message_router.route('/')
def get_all_messages():
    messages = Messages.query.filter(Messages.soure_type == "channel").all()
    if not messages:
        return jsonify([])
    return jsonify([message.to_dict() for message in messages])

# Edit channel Message


@channel_message_router.route('/<int:message_id>', methods=["PUT"])
@login_required
def edit_channel_message(message_id):
    form = ChannelMessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        existing_message = Messages.query.get_or_404(message_id)
        # handle forbidden error here
        existing_message.content = data['content']
        try:
            existing_message.edited = data['edited']
        except KeyError as e:
            pass
        existing_message.updated_at = datetime.now()
        db.session.commit()
        return jsonify({"Message": existing_message.to_dict()})
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# Delete channel message


@channel_message_router.route('/<int:message_id>', methods=['DELETE'])
@login_required
def delete_message(message_id):
    existing_message = Messages.query.get_or_404(message_id)
    if existing_message.sender_id != current_user.id:
        # handle  forbidden error here
        pass
    db.session.delete(existing_message)
    db.session.commit()
    return {'message': f'Message {message_id} has successfully been deleted.', 'statusCode': 200}
