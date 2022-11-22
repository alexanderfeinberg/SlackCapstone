from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import User, Workspace, Channel
from ..forms.channel_message_form import ChannelMessageForm
from ..forms.channel_form import ChannelForm
from ..models.db import db
from datetime import datetime

workspace_routes = Blueprint("workspaces", __name__)


@workspace_routes('/')
def get_all_work_spaces(self):
    workspaces = Workspace.query.all()

    if not workspaces:
        return jsonify([])
    return jsonify([workspace.to_dict_relations() for workspace in workspaces])


@workspace_routes('<int:workspace_id>')
def get_workspace_by_id(self, workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    return workspace.to_dict_relations()
