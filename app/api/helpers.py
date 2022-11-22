from ..models import User


def get_current_user(self, user_id):
    return User.query.get(int(user_id))
