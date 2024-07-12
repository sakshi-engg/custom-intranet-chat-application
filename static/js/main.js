const socket = io();

document.getElementById('send-button').onclick = function() {
    const message = document.getElementById('message-input').value;
    socket.send(message);
    document.getElementById('message-input').value = '';
};

document.getElementById('translate-button').onclick = function() {
    const message = document.getElementById('message-input').value;
    translateMessage(message);
};

document.getElementById('toggle-voice').onclick = function() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
};

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.start();
            toggleVoiceButton.textContent = 'Stop Recording';
            isRecording = true;
        })
        .catch(error => console.error('Error accessing microphone:', error));
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function stopRecording() {
    mediaRecorder.stop();
    toggleVoiceButton.textContent = 'Start Recording';
    isRecording = false;

    const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    sendVoiceMessage(audioUrl);
    recordedChunks = [];
}

function sendVoiceMessage(audioUrl) {
    const audioElement = document.createElement('audio');
    audioElement.src = audioUrl;
    audioElement.controls = true;
    const messageContainer = document.getElementById('messages');
    messageContainer.appendChild(audioElement);

    // Send voice message to server (optional)
    // socket.send(audioUrl);
}

socket.on('message', function(msg) {
    const messageContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on('translation', function(data) {
    appendTranslatedMessage(data.message, data.translated);
});

function appendTranslatedMessage(original, translated) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>Original:</strong> ${original}<br><strong>Translated:</strong> ${translated}`;
    const translatedMessages = document.getElementById('translated-messages');
    translatedMessages.appendChild(messageElement);
}
