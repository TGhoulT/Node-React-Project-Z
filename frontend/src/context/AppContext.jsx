import React, { createContext, useState, useEffect, useContext } from 'react';

// Создаём контекст
const AppContext = createContext();

// Провайдер, который будет оборачивать приложение
export const AppProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentUser, setCurrentUser] = useState({ id: 1, name: 'Алексей' });
    const [currentRoom, setCurrentRoom] = useState({ id: 1, name: 'Общий чат' });

    // Загрузка mock-данных
    useEffect(() => {
        const mockMessages = [
            { id: 1, text: 'Привет всем! Как дела?', authorId: 1, authorName: 'Алексей', roomId: 1, timestamp: '2023-10-26T10:30:00Z' },
            { id: 2, text: 'Всем спасибо, у меня всё отлично!', authorId: 2, authorName: 'Мария', roomId: 1, timestamp: '2023-10-26T10:35:00Z' },
        ];
        const mockUsers = [
            { id: 1, name: 'Алексей', avatarColor: '#3498db' },
            { id: 2, name: 'Мария', avatarColor: '#e74c3c' },
            { id: 3, name: 'Иван', avatarColor: '#2ecc71' },
        ];
        const mockRooms = [
            { id: 1, name: 'Общий чат', description: 'Основная комната' },
            { id: 2, name: 'Флудилка', description: 'Для неформального общения' },
        ];
        setMessages(mockMessages);
        setUsers(mockUsers);
        setRooms(mockRooms);
    }, []);

    // Функция отправки сообщения
    const sendMessage = (text) => {
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

    // Значения, которые будут доступны через контекст
    const value = {
        messages,
        users,
        rooms,
        currentUser,
        setCurrentUser,
        currentRoom,
        setCurrentRoom,
        sendMessage,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Хук для удобного использования контекста
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};