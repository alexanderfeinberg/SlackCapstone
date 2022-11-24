from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import User, Workspace, Channel
from ..forms.workspace_form import WorkspaceForm
from ..forms.channel_form import ChannelForm
from ..models.db import db
from datetime import datetime
from .helpers import get_current_user

workspace_router = Blueprint("workspaces", __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field}:{error}')
    return errorMessages

# Get all workspaces


@workspace_router.route('/')
def get_all_work_spaces():
    workspaces = Workspace.query.all()

    if not workspaces:
        return jsonify([])
    return jsonify([workspace.to_dict_relations() for workspace in workspaces])

# Get workspace by ID


@workspace_router.route('<int:workspace_id>')
def get_workspace_by_id(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    return workspace.to_dict_relations()

# Create new workspace


@workspace_router.route('/', methods=["POST"])
@login_required
def create_workspace():
    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    resp = get_current_user(
        current_user.id).check_unique_workspace_names(form.data['name'])
    if resp:
        raise Exception(
            f"You already have a workspace named {form.data['name']}")
    if form.validate_on_submit():
        new_workspace = Workspace(name=form.data['name'], url=form.data['url'],
                                  owner=get_current_user(current_user.id), users=[get_current_user(current_user.id)])
        db.session.add(new_workspace)
        db.session.commit()
        return jsonify(new_workspace.to_dict_relations())
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# Create channel


@workspace_router.route('/<int:workspace_id>/channels', methods=["POST"])
@login_required
def create_channel(workspace_id):
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        print("FORM DATAAA ", form.data.keys())
        del data['csrf_token']

        workspace = Workspace.query.get_or_404(workspace_id)
        new_channel = Channel(**data, owner=get_current_user(current_user.id),
                              workspace=workspace)
        db.session.add(new_channel)
        db.session.commit()

        return jsonify({"Channel": new_channel.to_dict()})

    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# Get all channels by workspace
@workspace_router.route('/<int:workspace_id>/channels')
def get_workspace_channels(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    return jsonify({"Channels": [channel.to_dict() for channel in workspace.channels]})

# Get subscribed channels within a workspace


@workspace_router.route('<int:workspace_id>/channels/subscribed')
@login_required
def subscribed_channels(workspace_id):
    user = get_current_user(current_user.id)
    channels = user.subbed_channels_by_workspace(workspace_id)
    return jsonify({"Channels": [channel.to_dict() for channel in channels]})


# Get subscribed worksapces
@workspace_router.route('/subscribed')
@login_required
def subscribed_workspaces():
    user = get_current_user(current_user.id)
    return jsonify([workspace.to_dict() for workspace in user.subscribed_workspaces])
