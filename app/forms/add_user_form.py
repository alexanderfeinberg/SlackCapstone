from flask_wtf import FlaskForm
from wtforms import IntegerField, BooleanField
from wtforms.validators import DataRequired, Email, Length
from app.models import User


class AddUserForm(FlaskForm):
    user_id = IntegerField("User", validators=[
                           DataRequired(message="User must be included.")])
