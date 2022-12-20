from .users import instances
from .workspaces import instances as workspaces
from .channels import instances as channels
from app.models import db, Messages, environment, SCHEMA


def seed_subscriptions():
    for user in instances:
        if not workspaces[0] in user.subscribed_workspaces:
            user.subscribed_workspaces.append(workspaces[0])
        for channel in channels:
            if channel not in user.subscribed_channels:
                user.subscribed_channels.append(channel)
    db.session.commit()


def undo_subscriptions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.users_in_channel RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM subscribed_channels")

    db.session.commit()
