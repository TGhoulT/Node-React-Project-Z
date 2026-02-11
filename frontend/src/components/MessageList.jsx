import React from 'react';
import './MessageList.css';

const MessageList = ({ messages, currentUser }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="message-list">
            <h2>Сообщения</h2>
            {messages.length === 0 ? (
                <div className="no-messages">
                    <p>Пока нет сообщений в этой комнате</p>
                    <p>Будьте первым, кто напишет!</p>
                </div>
            ) : (
                <div className="messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.authorId === currentUser.id ? 'own-message' : ''}`}
                        >
                            <div className="message-header">
                                <span className="message-author">{message.authorName}</span>
                                <span className="message-time">{formatTime(message.timestamp)}</span>
                            </div>
                            <div className="message-content">{message.text}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageList;