import React from 'react';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';
import UserList from '../components/UserList';
import RoomList from '../components/RoomList';

const ChatPage = ({ currentUser, currentRoom, setCurrentRoom, messages, users, rooms, onSendMessage }) => {
    return (
        <div className="app-container">
            <div className="sidebar">
                <div className="current-user">
                    <div className="user-avatar" style={{ backgroundColor: '#3498db' }}>
                        {currentUser.name.charAt(0)}
                    </div>
                    <div className="user-info">
                        <h3>{currentUser.name}</h3>
                        <p>Выбранная комната: <strong>{currentRoom.name}</strong></p>
                    </div>
                </div>
                <RoomList rooms={rooms} currentRoom={currentRoom} onSelectRoom={setCurrentRoom} />
                <UserList users={users} />
            </div>
            <div className="main-content">
                <div className="messages-container">
                    <MessageList
                        messages={messages.filter(msg => msg.roomId === currentRoom.id)}
                        currentUser={currentUser}
                    />
                    <MessageForm onSendMessage={onSendMessage} disabled={!currentUser.id} />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;