from app.models import db, ChannelMessages, environment, SCHEMA


def seed_channel_messages():
    instances = [
        ChannelMessages(sender_id=1, channel_id=1,
                        content="Testing!", edited=False),
        ChannelMessages(sender_id=1, channel_id=2,
                        content="Testing channel2", edited=False),
        ChannelMessages(sender_id=2, channel_id=2,
                        content="Testing user 2", edited=False),
        ChannelMessages(sender_id=3, channel_id=3,
                        content="Testing user nad channel3", edited=False),
    ]

    for instance in instances:
        db.session.add(instance)
    db.session.commit()


def undo_channel_messages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.ChannelMessages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM ChannelMessages")

    db.session.commit()
