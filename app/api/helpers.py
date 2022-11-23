from ..models import User


def get_current_user(user_id):
    return User.query.get(int(user_id))
