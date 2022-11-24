from app.models import db, Workspace, environment, SCHEMA


def seed_workspaces():
    instances = [
        Workspace(name="App Academy", owner_id=1, url="testURL")
    ]

    for instance in instances:
        db.session.add(instance)
    db.session.commit()


def undo_workspaces():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.workspaces RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM workspaces")

    db.session.commit()
