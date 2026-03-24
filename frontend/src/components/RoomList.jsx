import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 30px;
  text-align: left;
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
`;

const RoomsContainer = styled.div`
  /* можно оставить пустым, но для структуры */
`;

const RoomItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  &:hover {
    background: #eef2ff;
    transform: translateX(5px);
  }
  ${props => props.active && `
    border-color: #667eea;
    background: #eef2ff;
  `}
`;

const RoomIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const RoomName = styled.span`
  font-weight: 500;
  margin-bottom: 3px;
`;

const RoomDesc = styled.span`
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

const RoomList = ({ rooms, currentRoom, onSelectRoom }) => {
    return (
        <Container>
            <Title>Комнаты</Title>
            <RoomsContainer>
                {rooms.map((room) => (
                    <RoomItem
                        key={room.id}
                        active={currentRoom.id === room.id}
                        onClick={() => onSelectRoom(room)}
                        title={room.description}
                    >
                        <RoomIcon>#</RoomIcon>
                        <RoomInfo>
                            <RoomName>{room.name}</RoomName>
                            <RoomDesc>{room.description}</RoomDesc>
                        </RoomInfo>
                    </RoomItem>
                ))}
            </RoomsContainer>
        </Container>
    );
};

export default RoomList;