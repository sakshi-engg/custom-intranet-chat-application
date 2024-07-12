from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = 'd44e8a817bfd73ffb1a64e180b572ed3'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(msg):
    print(f'Message: {msg}')
    send(msg, broadcast=True)

@socketio.on('translate')
def handle_translation(data):
    message = data['message']
    translated = translate_message(message)
    emit('translation', {'message': message, 'translated': translated}, broadcast=True)

@socketio.on('voice_message')
def handle_voice_message(audio_data):
    audio_data = audio_data.split(",")[1]
    with open("received_audio.wav", "wb") as f:
        f.write(base64.b64decode(audio_data))

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
