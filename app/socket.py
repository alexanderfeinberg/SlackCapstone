from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request
import os


if os.environ.get("FLASK_ENV") == "production":
    origins = "*"
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)
users = {}


@socketio.on("sign_in")
def user_connect(data):
    print('SOCKET ID ', request.sid)
    print("SIGN IN EVENT")
    print("DATAA ", data)
    user = data['user']['firstName']
    users[request.sid] = user
    emit("sign_in", users, broadcast=True)
    print(f'client id:{request.sid} username:{user} has connected')


@socketio.on('disconnect')
def user_disconnect():
    del users[request.sid]
    emit(users)
    print(f'client {request.sid} has disconnected. ')


@socketio.on("chat")
def handle_chat(data):
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


@socketio.on("leave")
def on_leave(data):
    user = data['user']
    room = data['room']
    leave_room(room)
    print(f'{user} has left room {room}')
