import React, { useState, useEffect } from 'react';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import UserList from './components/UserList';
import RoomList from './components/RoomList';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentUser, setCurrentUser] = useState({ id: 1, name: 'Алексей' });
    const [currentRoom, setCurrentRoom] = useState({ id: 1, name: 'Общий чат' });

    // Загружаем данные при монтировании компонента
    useEffect(() => {
        // Здесь потом будут реальные запросы к API
        const mockMessages = [
            { id: 1, text: 'Привет всем! Как дела?', authorId: 1, authorName: 'Алексей', roomId: 1, timestamp: '2023-10-26T10:30:00Z' },
            { id: 2, text: 'Всем спасибо, у меня всё отлично!', authorId: 2, authorName: 'Мария', roomId: 1, timestamp: '2023-10-26T10:35:00Z' },
            { id: 3, text: 'Напомните, во сколько завтра собрание?', authorId: 3, authorName: 'Иван', roomId: 2, timestamp: '2023-10-26T11:00:00Z' },
        ];

        const mockUsers = [
            { id: 1, name: 'Алексей', avatarColor: '#3498db' },
            { id: 2, name: 'Мария', avatarColor: '#e74c3c' },
            { id: 3, name: 'Иван', avatarColor: '#2ecc71' },
        ];

        const mockRooms = [
            { id: 1, name: 'Общий чат', description: 'Основная комната' },
            { id: 2, name: 'Флудилка', description: 'Для неформального общения' },
            { id: 3, name: 'Техподдержка', description: 'Вопросы по проекту' },
        ];

        setMessages(mockMessages);
        setUsers(mockUsers);
        setRooms(mockRooms);
    }, []);

    const handleSendMessage = (text) => {
        // Здесь потом будет отправка на сервер
        const newMessage = {
            id: messages.length + 1,
            text,
            authorId: currentUser.id,
            authorName: currentUser.name,
            roomId: currentRoom.id,
            timestamp: new Date().toISOString(),
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>LocalLink Messenger</h1>
                <p>Мессенджер для локальной сети</p>
            </header>

            <div className="app-container">
                <div className="sidebar">
                    <div className="current-user">
                        <div
                            className="user-avatar"
                            style={{ backgroundColor: '#3498db' }}
                        >
                            {currentUser.name.charAt(0)}
                        </div>
                        <div className="user-info">
                            <h3>{currentUser.name}</h3>
                            <p>Выбранная комната: <strong>{currentRoom.name}</strong></p>
                        </div>
                    </div>

                    <RoomList
                        rooms={rooms}
                        currentRoom={currentRoom}
                        onSelectRoom={setCurrentRoom}
                    />

                    <UserList users={users} />
                </div>

                <div className="main-content">
                    <div className="messages-container">
                        <MessageList
                            messages={messages.filter(msg => msg.roomId === currentRoom.id)}
                            currentUser={currentUser}
                        />

                        <MessageForm
                            onSendMessage={handleSendMessage}
                            disabled={!currentUser.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;