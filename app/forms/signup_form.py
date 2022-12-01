from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    print("FIELD DATA ", field.data)
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email is already in use.')


class SignUpForm(FlaskForm):
    # username = StringField(
    #     'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[
                        DataRequired(), Email(), user_exists])
    first_name = StringField('First name', validators=[
                             DataRequired(message="First name is required")])
    last_name = StringField('Last name', validators=[
        DataRequired(message="Last name is required")])
    password = StringField('password', validators=[DataRequired()])
