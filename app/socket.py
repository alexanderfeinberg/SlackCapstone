from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request
import os
from .models.messages import Messages


if os.environ.get("FLASK_ENV") == "production":
    origins = "*"
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins, engineio_logger=True)
users = {}


def load_past_messages(channel_id):
    messages = Messages.query.filter(
        Messages.source_id == channel_id).all()
    print("Messages ", [message.to_dict() for message in messages])
    return [message.to_dict() for message in messages]


@socketio.on("sign_in")
def user_connect(data):
    print('SOCKET ID ', request.sid)
    print("SIGN IN EVENT")
    print("DATAA ", data)
    user = data['user']
    users[request.sid] = user
    emit("sign_in", users if users else [], broadcast=True)
    print(f'client id:{request.sid} username:{user} has connected')


@socketio.on('disconnect')
def user_disconnect():
    print(users)
    print(request.sid)
    print("DISCONNECT EVENTTT")
    emit("user_disconnect", users[request.sid], broadcast=True)
    if request.sid in users:
        del users[request.sid]
    print(f'client {request.sid} has disconnected. ')


@socketio.on("chat")
def handle_chat(data):
    print("CHAT DATA ", data)
    room = data['room']
    emit("chat", data, to=room)

    # to=room


@socketio.on("join")
def on_join(data):
    print("JOIN DATA ", data)
    user = data['user']
    room = data['room']
    join_room(room)
    print(f'{user} has entered room {room}')
    # emit('join', , to=room)


@socketio.on("leave")
def on_leave(data):
    user = data['user']
    room = data['room']
    leave_room(room)
    print(f'{user} has left room {room}')


@socketio.on("load_messages")
def load_messages(data):
    room = data['room']
    messages = load_past_messages(room)
    print("LOAD PREV MESSAGES ", messages)
    emit('load_messages', messages, to=room)


@socketio.on("incoming_dm")
def incoming_dm(data):
    print("INCOMING DM EVENT")
    room = data['room']
    emit("incoming_dm", data['directMessage'], to=room)
