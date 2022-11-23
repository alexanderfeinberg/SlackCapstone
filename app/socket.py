from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request
import os


if os.environ.get("FLASK_ENV") == "production":
    origins = "*"
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)
users = {}


@socketio.on("connect")
def user_connect(data):
    print('SOCKET ID ', request.sid)
    user = data['user']
    users[request.sid] = user
    emit(users)
    print(f'client id:{request.sid} username:{user} has connected')


@socketio.on('disconnet')
def user_disconnect():
    del users[request.sid]
    emit(users)
    print(f'client {request.sid} has disconnected. ')


@socketio.on("chat")
def handle_chat(data):
    room = data['room']
    emit("chat", data, to=room)


@socketio.on("join")
def on_join(data):
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
