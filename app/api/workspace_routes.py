from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import User, Workspace, Channel
from ..forms.workspace_form import WorkspaceForm
from ..forms.channel_form import ChannelForm
from ..models.db import db
from datetime import datetime
from .helpers import get_current_user

workspace_routes = Blueprint("workspaces", __name__)


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


@workspace_routes('/')
def get_all_work_spaces():
    workspaces = Workspace.query.all()

    if not workspaces:
        return jsonify([])
    return jsonify([workspace.to_dict_relations() for workspace in workspaces])

# Get workspace by ID


@workspace_routes('<int:workspace_id>')
def get_workspace_by_id(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    return workspace.to_dict_relations()

# Create new workspace


@workspace_routes('/', methods=["POST"])
@login_required
def create_workspace():
    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_workspace = Workspace(name=form.data['name'], url=form.data['url'],
                                  owner=get_current_user(current_user.id))
        db.session.add(new_workspace)
        db.session.commit()
        return jsonify(new_workspace.to_dict_relations())
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# Create channel


@workspace_routes('/<int:workspace_id>/channels', methods=["POST"])
@login_required
def create_channel(workspace_id):
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        del data['csrf_token']
        del data['submit']

        workspace = Workspace.query.get_or_404(workspace_id)
        new_channel = Channel(**data, owner=get_current_user(current_user.id),
                              workspace=workspace)
        db.session.add(new_channel)
        db.session.commit()

        return jsonify(new_channel.to_dict_relations())

    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# Get all channels by workspace
@workspace_routes('/<int:workspace_id>/channels')
def get_workspace_channels(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    return jsonify([channel.to_dict_relations() for channel in workspace.channels])
