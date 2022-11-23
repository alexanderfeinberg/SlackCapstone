from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get_or_404(id)
    return user.to_dict()


@user_routes.route('/<int:id>/owned-workspaces')
@login_required
def owned_workspaces(id):
    """
    Query for owned workspaces of a user
    """
    user = User.query.get_or_404(id)
    if not user.owned_workspaces:
        return jsonify([])
    return jsonify([workspace.to_dict() for workspace in user.owned_workspaces])


@user_routes.route('/<int:id>/subscribed-workspaces')
@login_required
def subbed_workspaces(id):
    """
    Query for subscribed workspaces of a user
    """
    user = User.query.get_or_404(id)
    if not user.subscribed_workspaces:
        return jsonify([])
    return jsonify([workspace.to_dict() for workspace in user.subscribed_workspaces])


@user_routes.route('/<int:id>/owned-channels')
@login_required
def owned_channels(id):
    """
    Query for owned channels of a user
    """
    user = User.query.get_or_404(id)
    if not user.owned_channels:
        return jsonify([])
    return jsonify([channel.to_dict() for channel in user.owned_channels])


@user_routes.route('/<int:id>/subscribed-channels')
@login_required
def subbed_channels(id):
    """
    Query for subscribed channels of a user
    """
    user = User.query.get_or_404(id)
    if not user.subscribed_channels:
        return jsonify([])
    return jsonify([channel.to_dict() for channel in user.subscribed_channels])


@user_routes.route('/<int:id>/messages')
@login_required
def user_messages(id):
    """
    Query for messages of a user
    """
    user = User.query.get_or_404(id)
    if not user.channel_messages:
        return jsonify([])
    return jsonify([message.to_dict() for message in user.channel_messages])
