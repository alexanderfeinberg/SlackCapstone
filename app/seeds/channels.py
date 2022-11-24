from app.models import db, Channel, environment, SCHEMA


def seed_channels():
    instances = [
        Channel(name="general", owner_id=1,
                workspace_id=1, description="General chat"),
        Channel(name="NY-Jets", owner_id=1,
                workspace_id=1, description="Channel to talk about the jets"),
        Channel(name="DS-A", owner_id=1,
                workspace_id=1, description="Data structures and algorithms chat"),
        Channel(name="Python", owner_id=1,
                workspace_id=1, description="Chat for Python questions"),
        Channel(name="JavaScript", owner_id=1,
                workspace_id=1, description="Chat for JavaScript questions"),
        Channel(name="Job-Search", owner_id=1,
                workspace_id=1, description="Job search help chat"),
    ]

    for instance in instances:
        db.session.add(instance)
    db.session.commit()


def undo_channels():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM channels")

    db.session.commit()
