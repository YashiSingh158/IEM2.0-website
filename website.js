const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const emojiButton = document.getElementById('emoji-button');
const emojiTray = document.getElementById('emoji-tray');

let canSendMessage = true;
let replyToMessage = null;
let cooldownTime = 0;

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function appendMessage(content, color, messageId) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add('replyable');
    messageDiv.style.color = color;
    messageDiv.setAttribute('data-message-id', messageId);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = content;

    const replyButton = document.createElement('button');
    replyButton.classList.add('reply-button');
    replyButton.textContent = 'Reply';

    const reportButton = document.createElement('button');
    reportButton.classList.add('report-button');
    reportButton.textContent = 'Report';

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(replyButton);
    messageDiv.appendChild(reportButton);

    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function clearReply() {
    replyToMessage = null;
    messageInput.placeholder = 'Type your message...';
    const messages = document.querySelectorAll('.replyable');
    messages.forEach(message => message.classList.remove('highlighted'));
}

function updateCooldownDisplay() {
    // messageInput.placeholder = `Cooldown: ${cooldownTime} seconds`;
    messageInput.placeholder = `Type your message...`;

}

function sendMessage() {
    if (!canSendMessage) return;

    if (cooldownTime > 0) {
        updateCooldownDisplay();
        return;
    }

    const content = messageInput.value;
    if (content.trim() !== '') {
        const userColor = getRandomColor();
        const messageId = Date.now().toString();
        appendMessage(`You: ${content}`, userColor, messageId);
        messageInput.value = '';

        canSendMessage = false;
        cooldownTime = 0; // Reset cooldown
        updateCooldownDisplay();

        setTimeout(() => {
            canSendMessage = true;
            updateCooldownDisplay();
        }, 1000);

        // Simulate sending message to server
        // Here you can implement sending data to your server using AJAX or WebSocket
    }
}

function addEmojiToMessage(emoji) {
    messageInput.value += emoji;
    messageInput.focus();
}

messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);

messageContainer.addEventListener('click', function(event) {
    const replyButton = event.target.closest('.reply-button');
    const reportButton = event.target.closest('.report-button');

    if (replyButton) {
        const messageDiv = replyButton.closest('.message');
        const messageId = messageDiv.getAttribute('data-message-id');
        const messageText = messageDiv.querySelector('.message-content').textContent;

        clearReply();

        messageDiv.classList.add('highlighted');

        replyToMessage = { messageId, messageText };
        messageInput.placeholder = `Replying to: ${messageText}`;
        messageInput.focus();
    }

    if (reportButton) {
        const messageDiv = reportButton.closest('.message');
        const reportedMessageId = messageDiv.getAttribute('data-message-id');

        if (!messageDiv.classList.contains('reported')) {
            messageDiv.classList.add('reported');
            cooldownTime = 30; // Set cooldown time to 30 seconds
            updateCooldownDisplay();
        }
    }
});

emojiButton.addEventListener('click', function() {
    emojiTray.classList.toggle('emoji-tray-visible');
});

emojiTray.addEventListener('click', function(event) {
    const emoji = event.target.closest('.emoji');
    if (emoji) {
        const emojiText = emoji.textContent;
        addEmojiToMessage(emojiText);
        emojiTray.classList.remove('emoji-tray-visible');
    }
});

// Start countdown for cooldown display
setInterval(() => {
    if (cooldownTime > 0) {
        cooldownTime--;
        updateCooldownDisplay();
    }
}, 1000);
