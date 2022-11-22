from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired, Email, Length
from app.models import User


class ChannelForm(FlaskForm):
    name = StringField("Name", validators=[
                       DataRequired(message="Channel name is required."),
                       Length(max=80, message="Channel name must be less than 80 characters")])
    description = StringField("Description")
