from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

# Initialize the Flask application
app = Flask(__name__)

# Replace 'your_secret_key' with a secure key for session management.
app.config['SECRET_KEY'] = 'd44e8a817bfd73ffb1a64e180b572ed3'

# Initialize SocketIO for real-time communication
socketio = SocketIO(app, cors_allowed_origins="*")

# Define the route for the home page
@app.route('/')
def index():
    return render_template('index.html')

# Handle incoming text messages
@socketio.on('message')
def handle_message(msg):
    print(f'Message: {msg}')
    send(msg, broadcast=True)

# Handle incoming file uploads
@socketio.on('file')
def handle_file(data):
    print(f'File received: {data["fileName"]}')
    emit('file', data, broadcast=True)

# Run the Flask application
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)

