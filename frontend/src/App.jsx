import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import ChatPage from './pages/ChatPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';

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

function App() {
    // Контекст используется дочерними компонентами, в App он не нужен, но можно взять для навигации
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
                        <Route path="/" element={<ChatPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    );
}

export default App;