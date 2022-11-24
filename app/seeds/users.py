from app.models import db, User, environment, SCHEMA

instances = [
    User(
        first_name='Test', last_name='Test', email='demo@gmail.com', password='password'),
    User(
        first_name='Test', last_name='Test', email='demo1@gmail.com', password='password'),
    User(
        first_name='Test', last_name='Test', email='demo2@gmail.com', password='password'),
    User(
        first_name='Test', last_name='Test', email='demo3@gmail.com', password='password'),
    User(
        first_name='Test', last_name='Test', email='demo4@gmail.com', password='password'),
    User(
        first_name='Test', last_name='Test', email='demo5@gmail.com', password='password'),
    User(
        first_name='Test', last_name='Test', email='demo6@gmail.com', password='password'),

]
# Adds a demo user, you can add other users here if you want


def seed_users():

    for instance in instances:
        db.session.add(instance)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")

    db.session.commit()
