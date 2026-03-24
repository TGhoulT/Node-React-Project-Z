import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import ChatPage from './pages/ChatPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';

// Стилизованные компоненты для навигации
const Nav = styled.nav`
  background: #667eea;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
  &:hover {
    background: #764ba2;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const App = () => {
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

    const handleSendMessage = (text) => {
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
        <BrowserRouter>
            <div>
                <Nav>
                    <NavLink to="/">Чат</NavLink>
                    <NavLink to="/about">О проекте</NavLink>
                    <NavLink to="/profile">Профиль</NavLink>
                </Nav>
                <Container>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ChatPage
                                    currentUser={currentUser}
                                    currentRoom={currentRoom}
                                    setCurrentRoom={setCurrentRoom}
                                    messages={messages}
                                    users={users}
                                    rooms={rooms}
                                    onSendMessage={handleSendMessage}
                                />
                            }
                        />
                        <Route path="/about" element={<AboutPage />} />
                        <Route
                            path="/profile"
                            element={
                                <ProfilePage
                                    currentUser={currentUser}
                                    setCurrentUser={setCurrentUser}
                                />
                            }
                        />
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    );
};

export default App;