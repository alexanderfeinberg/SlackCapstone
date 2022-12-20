from app.models import db, Messages, environment, SCHEMA

instances = [
    Messages(sender_id=1, source_id=1, source_type="channel",
             content="Testing!", edited=False),
    Messages(sender_id=1, source_id=2, source_type="channel",
             content="Testing channel2", edited=False),
    Messages(sender_id=2, source_id=2, source_type="channel",
             content="Testing user 2", edited=False),
    Messages(sender_id=3, source_id=3, source_type="channel",
             content="Testing user nad channel3", edited=False),
]


def seed_channel_messages():

    for instance in instances:
        db.session.add(instance)
    db.session.commit()


def undo_channel_messages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.Messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM Messages")

    db.session.commit()
