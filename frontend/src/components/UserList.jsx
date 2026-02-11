import React from 'react';
import './UserList.css';

const UserList = ({ users }) => {
    return (
        <div className="user-list">
            <h3>Пользователи онлайн ({users.length})</h3>
            <div className="users">
                {users.map((user) => (
                    <div key={user.id} className="user-item">
                        <div
                            className="user-avatar"
                            style={{ backgroundColor: user.avatarColor }}
                        >
                            {user.name.charAt(0)}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user.name}</span>
                            <span className="user-status online"></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;