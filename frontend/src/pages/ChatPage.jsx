import React from 'react';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';
import UserList from '../components/UserList';
import RoomList from '../components/RoomList';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 150px);
`;

const Sidebar = styled.div`
  width: 300px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  padding: 20px;
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const CurrentUser = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-right: 15px;
`;

const UserInfo = styled.div`
  text-align: left;
  h3 {
    margin: 0;
  }
  p {
    margin: 5px 0 0;
    font-size: 14px;
    color: #666;
  }
`;

const ChatPage = () => {
    const { currentUser, currentRoom, setCurrentRoom, messages, users, rooms, sendMessage } = useAppContext();

    return (
        <AppContainer>
            <Sidebar>
                <CurrentUser>
                    <UserAvatar>{currentUser.name.charAt(0)}</UserAvatar>
                    <UserInfo>
                        <h3>{currentUser.name}</h3>
                        <p>Выбранная комната: <strong>{currentRoom.name}</strong></p>
                    </UserInfo>
                </CurrentUser>
                <RoomList rooms={rooms} currentRoom={currentRoom} onSelectRoom={setCurrentRoom} />
                <UserList users={users} />
            </Sidebar>
            <MainContent>
                <MessagesContainer>
                    <MessageList messages={messages.filter(msg => msg.roomId === currentRoom.id)} currentUser={currentUser} />
                    <MessageForm onSendMessage={sendMessage} disabled={!currentUser.id} />
                </MessagesContainer>
            </MainContent>
        </AppContainer>
    );
};

export default ChatPage;