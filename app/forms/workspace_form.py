from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired, Length
from app.models import User


class WorkspaceForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(
        message="Workspace name is required"), Length(max=120, message="Name must be less than 120 characters.")])
    url = StringField("URL", validators=[DataRequired(message="Workspace URL is required"), Length(
        max=500, message="URL must be less than 500 characters")])
