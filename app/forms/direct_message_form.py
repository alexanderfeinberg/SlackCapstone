from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import User


def verify_recipient(form, field):
    user_id = field.data
    print("FIELD DATA ", field.data)
    user = User.query.get(user_id)
    if not user:
        raise ValidationError("Recipient does not exist.")


class DirectMessageForm(FlaskForm):
    workspace_id = IntegerField("workspace_id", validators=[
                                DataRequired("Workspace is required")])
    recipient = StringField("recipient", validators=[
                            DataRequired("Recipient is required."), verify_recipient])
