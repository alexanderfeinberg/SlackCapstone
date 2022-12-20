from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import db, User, DirectMessage, Messages
from ..forms.channel_message_form import ChannelMessageForm

direct_message_router = Blueprint("direct_message", __name__)


@direct_message_router.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_direct_message(id):
    direct_message = DirectMessage.query.get_or_404(id)
    user = User.query.get(current_user.id)
    print("User in dms ", user in direct_message.users)
    if user not in direct_message.users:
        return {"errors": ["User is not in direct message chat"]}
    db.session.delete(direct_message)
    db.session.commit()
    return {"Message": "Direct message deleted."}


@direct_message_router.route('/<int:id>')
@login_required
def get_direct_message(id):
    direct_message = DirectMessage.query.get_or_404(id)
    user = User.query.get_or_404(current_user.id)
    if not user in direct_message.users:
        return {"errors": ["User can not access direct message"]}, 404

    return {"DirectMessage": direct_message.to_dict()}


@direct_message_router.route('/<int:id>/messages')
@login_required
def get_direct_messages(id):
    user = User.query.get(current_user.id)
    direct_message = DirectMessage.query.get_or_404(id)
    if user not in direct_message.users:
        return {"errors": ["User can not access direct message"]}, 404

    return {"Messages": [message.to_dict() for message in direct_message.messages]}


@direct_message_router.route('<int:id>/messages', methods=["POST"])
@login_required
def create_direct_messages(id):
    form = ChannelMessageForm()
    if form.validate_on_submit():
        direct_message = DirectMessage.query.get_or_404(id)
        user = User.query.get(current_user.id)
        if not user in direct_message.users:
            return {"errors": ["User can not access direct message"]}, 404

        message = Messages(
            sender=current_user, content=form.data['content'], source_id=direct_message.id, source_type="directMessage")
        message.direct_message_chat = direct_message
        db.session.add(message)
        db.session.commit()
        return {"Message": message.to_dict()}
    return {"errors": [form.errors]}, 404
