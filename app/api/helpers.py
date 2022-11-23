from ..models import User


def get_current_user(user_id):
    return User.query.get_or_404(int(user_id))
