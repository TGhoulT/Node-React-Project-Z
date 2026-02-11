import React, { useState } from 'react';
import './MessageForm.css';

const MessageForm = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={disabled ? "Выберите пользователя для отправки сообщений" : "Введите сообщение..."}
                disabled={disabled}
            />
            <button
                type="submit"
                disabled={!message.trim() || disabled}
                title={disabled ? "Сначала выберите пользователя" : "Отправить сообщение"}
            >
                Отправить
            </button>
        </form>
    );
};

export default MessageForm;