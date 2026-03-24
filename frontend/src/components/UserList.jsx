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

const UsersContainer = styled.div`
  /* можно оставить пустым */
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.2s;
  cursor: pointer;
  &:hover {
    background: #e9e9e9;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
  background-color: ${props => props.color || '#3498db'};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const Name = styled.span`
  font-weight: 500;
`;

const Status = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4CAF50;
`;

const UserList = ({ users }) => {
    return (
        <Container>
            <Title>Пользователи онлайн ({users.length})</Title>
            <UsersContainer>
                {users.map((user) => (
                    <UserItem key={user.id}>
                        <Avatar color={user.avatarColor}>
                            {user.name.charAt(0)}
                        </Avatar>
                        <Details>
                            <Name>{user.name}</Name>
                            <Status />
                        </Details>
                    </UserItem>
                ))}
            </UsersContainer>
        </Container>
    );
};

export default UserList;