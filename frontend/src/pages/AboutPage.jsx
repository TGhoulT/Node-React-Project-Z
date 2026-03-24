import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  color: #667eea;
  margin-bottom: 20px;
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
`;

const AboutPage = () => {
    return (
        <Container>
            <Title>LocalLink Messenger</Title>
            <Text>
                Мессенджер для локальной сети, разработанный в учебных целях.
                Использует Node.js + Express на бэкенде и React на фронтенде.
            </Text>
            <Text>
                Версия 1.0. Функционал: отправка сообщений, комнаты, пользователи.
            </Text>
        </Container>
    );
};

export default AboutPage;