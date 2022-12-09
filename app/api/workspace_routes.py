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
    return {"Workspace": workspace.to_dict()}

# Create new workspace


@workspace_router.route('/', methods=["POST"])
@login_required
def create_workspace():
    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    resp = get_current_user(
        current_user.id).check_unique_workspace_names(form.data['name'])

    if resp:
        return {"errors": f"You already have a workspace named {form.data['name']}"}

    if form.validate_on_submit():
        print("FORM VALIDATED")
        new_workspace = Workspace(name=form.data['name'], url=form.data['url'],
                                  owner=get_current_user(current_user.id), users=[get_current_user(current_user.id)])
        db.session.add(new_workspace)
        db.session.commit()
        return jsonify({"Workspace": new_workspace.to_dict_relations()})
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# Edit a workspace


@workspace_router.route('/<int:workspace_id>', methods=['PUT'])
@login_required
def edit_workspace(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    if workspace.owner_id != current_user.id:
        return {"errors": "Unauthroized"}, 404

    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if 'csrf_token' in form.data:
            del form.data['csrf_token']
        if 'submit' in form.data:
            del form.data['submit']

        for key in form.data.keys():
            setattr(workspace, key, form.data[key])
        db.session.commit()
        return {"Workspace": workspace.to_dict()}
    return {"errors": form.errors}, 404


# Delete a workspace
@workspace_router.route('/<int:workspace_id>', methods=['DELETE'])
@login_required
def delete_workspace(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    db.session.delete(workspace)
    db.session.commit()
    return {"message": "Worksapce succesfully deleted."}, 200

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
        exists = Channel.query.filter(
            Channel.name == form.data['name']).first()
        if (exists and exists.workspace_id == workspace_id):
            return {"errors": ["A channel with this name already exists"]}, 401

        workspace = Workspace.query.get_or_404(workspace_id)
        new_channel = Channel(**data, owner=get_current_user(current_user.id),
                              workspace=workspace)
        new_channel.add_user(get_current_user(current_user.id))
        db.session.add(new_channel)
        db.session.commit()

        return jsonify({"Channel": new_channel.to_dict(current_user.id, owner=True)})

    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# Get all channels by workspace
@workspace_router.route('/<int:workspace_id>/channels')
def get_workspace_channels(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    return jsonify({"Channels": [channel.to_dict(user_id=current_user.id) for channel in workspace.channels]})

# Get subscribed channels within a workspace


@workspace_router.route('<int:workspace_id>/channels/subscribed')
@login_required
def subscribed_channels(workspace_id):
    user = get_current_user(current_user.id)
    channels = user.subbed_channels_by_workspace(workspace_id)
    return jsonify({"Channels": [channel.to_dict(current_user.id) for channel in channels]})


# Get subscribed worksapces
@workspace_router.route('/subscribed')
@login_required
def subscribed_workspaces():
    user = get_current_user(current_user.id)
    return jsonify({"Workspaces": [workspace.to_dict() for workspace in user.subscribed_workspaces]})
