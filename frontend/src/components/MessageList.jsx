import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  text-align: left;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
`;

const NoMessages = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  font-style: italic;
`;

const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
`;

const MessageItem = styled.div`
  background: ${props => props.isOwn ? '#667eea' : '#f0f0f0'};
  color: ${props => props.isOwn ? 'white' : 'inherit'};
  border-radius: 10px;
  padding: 10px 15px;
  margin-bottom: 15px;
  text-align: left;
  max-width: 70%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.isOwn ? 'auto' : '0'};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Author = styled.span`
  font-weight: bold;
`;

const Time = styled.span`
  opacity: 0.7;
  font-size: 12px;
`;

const Content = styled.div`
  word-wrap: break-word;
  line-height: 1.4;
`;

const MessageList = ({ messages, currentUser }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Container>
            <Title>Сообщения</Title>
            {messages.length === 0 ? (
                <NoMessages>
                    <p>Пока нет сообщений в этой комнате</p>
                    <p>Будьте первым, кто напишет!</p>
                </NoMessages>
            ) : (
                <MessagesList>
                    {messages.map((message) => (
                        <MessageItem key={message.id} isOwn={message.authorId === currentUser.id}>
                            <Header>
                                <Author>{message.authorName}</Author>
                                <Time>{formatTime(message.timestamp)}</Time>
                            </Header>
                            <Content>{message.text}</Content>
                        </MessageItem>
                    ))}
                </MessagesList>
            )}
        </Container>
    );
};

export default MessageList;