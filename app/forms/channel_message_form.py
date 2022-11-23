from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


class ChannelMessageForm(FlaskForm):
    content = StringField("Message", validators=[
                          DataRequired(message="Message required")])
    edited = BooleanField("Edited")
