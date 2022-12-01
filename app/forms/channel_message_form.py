from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


class ChannelMessageForm(FlaskForm):
    content = StringField("Message", validators=[
                          DataRequired(message="Message required"), Length(min=1, max=500, message="Message must be between 1 and 500 characters.")])
    edited = BooleanField("Edited")
