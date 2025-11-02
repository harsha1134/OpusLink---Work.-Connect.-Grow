class ChatSystem {
    static currentChat = null;
    static messages = [];

    static init() {
        this.loadChats();
        this.setupEventListeners();
    }

    static loadChats() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const chats = JSON.parse(localStorage.getItem('opuslink_chats') || '[]');
        const userChats = chats.filter(chat => 
            chat.participant1Id === currentUser.id || chat.participant2Id === currentUser.id
        );

        this.displayChats(userChats);
    }

    static displayChats(chats) {
        const container = document.getElementById('chatsList');
        if (!container) return;

        if (chats.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>No conversations yet</h3>
                    <p>Start a conversation by messaging a worker or employer</p>
                </div>
            `;
            return;
        }

        container.innerHTML = chats.map(chat => {
            const otherUser = this.getOtherUser(chat);
            const lastMessage = chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1] 
                : null;

            return `
                <div class="chat-item" onclick="ChatSystem.openChat('${chat.id}')">
                    <div class="chat-avatar">${otherUser.name.charAt(0)}</div>
                    <div class="chat-info">
                        <div class="chat-name">${otherUser.name}</div>
                        <div class="chat-preview">
                            ${lastMessage ? lastMessage.text : 'No messages yet'}
                        </div>
                    </div>
                    <div class="chat-meta">
                        ${lastMessage ? this.getTimeAgo(lastMessage.timestamp) : ''}
                        ${this.getUnreadCount(chat.id) > 0 ? 
                            `<span class="chat-unread">${this.getUnreadCount(chat.id)}</span>` : ''
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    static openChat(chatId) {
        const chats = JSON.parse(localStorage.getItem('opuslink_chats') || '[]');
        const chat = chats.find(c => c.id === chatId);
        
        if (!chat) return;

        this.currentChat = chat;
        this.messages = chat.messages || [];
        
        this.displayMessages();
        this.markAsRead(chatId);
        
        const chatInterface = document.getElementById('chatInterface');
        const chatsSidebar = document.getElementById('chatsSidebar');
        
        if (chatInterface) chatInterface.style.display = 'flex';
        if (chatsSidebar) chatsSidebar.style.display = 'none';

        this.updateChatHeader(chat);
    }

    static updateChatHeader(chat) {
        const otherUser = this.getOtherUser(chat);
        const userNameElement = document.getElementById('chatUserName');
        if (userNameElement) {
            userNameElement.textContent = otherUser.name;
        }
    }

    static displayMessages() {
        const container = document.getElementById('chatMessages');
        if (!container || !this.currentChat) return;

        container.innerHTML = this.messages.map(message => `
            <div class="message ${message.senderId === JSON.parse(sessionStorage.getItem('currentUser')).id ? 'sent' : 'received'}">
                <div class="message-content">
                    <div class="message-text">${message.text}</div>
                    <div class="message-time">${this.getTimeAgo(message.timestamp)}</div>
                </div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;
    }

    static sendMessage(text) {
        if (!text.trim() || !this.currentChat) return;

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const message = {
            id: 'msg_' + Date.now(),
            text: text.trim(),
            senderId: currentUser.id,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.messages.push(message);

        const chats = JSON.parse(localStorage.getItem('opuslink_chats') || '[]');
        const chatIndex = chats.findIndex(c => c.id === this.currentChat.id);
        
        if (chatIndex !== -1) {
            if (!chats[chatIndex].messages) chats[chatIndex].messages = [];
            chats[chatIndex].messages.push(message);
            chats[chatIndex].lastActivity = new Date().toISOString();
            localStorage.setItem('opuslink_chats', JSON.stringify(chats));
        }

        this.displayMessages();

        const otherUser = this.getOtherUser(this.currentChat);
        NotificationSystem.createNotification(otherUser.id, 'message', {
            from: currentUser.companyName || currentUser.fullName,
            message: text.trim()
        });

        const messageInput = document.getElementById('messageInput');
        if (messageInput) messageInput.value = '';
    }

    static startNewChat(userId, userName) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        const chats = JSON.parse(localStorage.getItem('opuslink_chats') || '[]');
        const existingChat = chats.find(chat => 
            (chat.participant1Id === currentUser.id && chat.participant2Id === userId) ||
            (chat.participant1Id === userId && chat.participant2Id === currentUser.id)
        );

        if (existingChat) {
            this.openChat(existingChat.id);
            return;
        }

        const newChat = {
            id: 'chat_' + Date.now(),
            participant1Id: currentUser.id,
            participant1Name: currentUser.companyName || currentUser.fullName,
            participant2Id: userId,
            participant2Name: userName,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            messages: []
        };

        chats.push(newChat);
        localStorage.setItem('opuslink_chats', JSON.stringify(chats));

        this.openChat(newChat.id);
        this.loadChats();
    }

    static getOtherUser(chat) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        return {
            id: chat.participant1Id === currentUser.id ? chat.participant2Id : chat.participant1Id,
            name: chat.participant1Id === currentUser.id ? chat.participant2Name : chat.participant1Name
        };
    }

    static getUnreadCount(chatId) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const chats = JSON.parse(localStorage.getItem('opuslink_chats') || '[]');
        const chat = chats.find(c => c.id === chatId);
        
        if (!chat || !chat.messages) return 0;
        
        return chat.messages.filter(msg => 
            msg.senderId !== currentUser.id && !msg.read
        ).length;
    }

    static markAsRead(chatId) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const chats = JSON.parse(localStorage.getItem('opuslink_chats') || '[]');
        const chatIndex = chats.findIndex(c => c.id === chatId);
        
        if (chatIndex !== -1 && chats[chatIndex].messages) {
            chats[chatIndex].messages.forEach(msg => {
                if (msg.senderId !== currentUser.id) {
                    msg.read = true;
                }
            });
            localStorage.setItem('opuslink_chats', JSON.stringify(chats));
            this.loadChats();
        }
    }

    static getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }

    static setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage(messageInput.value);
                }
            });
        }

        const sendButton = document.getElementById('sendMessageBtn');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage(messageInput.value);
            });
        }

        const backButton = document.getElementById('backToChats');
        if (backButton) {
            backButton.addEventListener('click', () => {
                const chatInterface = document.getElementById('chatInterface');
                const chatsSidebar = document.getElementById('chatsSidebar');
                
                if (chatInterface) chatInterface.style.display = 'none';
                if (chatsSidebar) chatsSidebar.style.display = 'block';
                
                this.currentChat = null;
                this.loadChats();
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ChatSystem.init();
});