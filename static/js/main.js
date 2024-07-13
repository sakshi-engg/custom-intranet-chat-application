const socket = io();

// Handle send button click event
document.getElementById('send-button').onclick = function() {
    const message = document.getElementById('message-input').value;
    socket.send(message);
    document.getElementById('message-input').value = '';
};

// Handle file input change event
document.getElementById('file-input').onchange = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            socket.emit('file', { 
                file: e.target.result, 
                fileName: file.name 
            });
        };
        reader.readAsDataURL(file);
    }
};

// Handle incoming text messages
socket.on('message', function(msg) {
    const messageContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    messageElement.className = 'message'; // Apply message class for styling
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

// Handle incoming file uploads
socket.on('file', function(data) {
    const messageContainer = document.getElementById('messages');
    const fileElement = document.createElement('a');
    fileElement.href = data.file;
    fileElement.download = data.fileName;
    fileElement.textContent = `Download ${data.fileName}`;
    fileElement.className = 'file-link'; // Apply file-link class for styling
    messageContainer.appendChild(fileElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});
