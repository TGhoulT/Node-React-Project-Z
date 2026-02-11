import React from 'react';
import './RoomList.css';

const RoomList = ({ rooms, currentRoom, onSelectRoom }) => {
    return (
        <div className="room-list">
            <h3>Комнаты</h3>
            <div className="rooms">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={`room-item ${currentRoom.id === room.id ? 'active' : ''}`}
                        onClick={() => onSelectRoom(room)}
                        title={room.description}
                    >
                        <div className="room-icon">#</div>
                        <div className="room-info">
                            <span className="room-name">{room.name}</span>
                            <span className="room-desc">{room.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomList;