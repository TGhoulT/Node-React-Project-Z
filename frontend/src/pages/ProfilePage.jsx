import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
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

const Field = styled.div`
  margin-bottom: 15px;
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
`;

const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
`;

const ProfilePage = ({ currentUser, setCurrentUser }) => {
    const [username, setUsername] = React.useState(currentUser.name);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentUser({ ...currentUser, name: username });
        alert('Профиль обновлён!');
    };

    return (
        <Container>
            <Title>Настройки профиля</Title>
            <form onSubmit={handleSubmit}>
                <Field>
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Field>
                <Button type="submit">Сохранить</Button>
            </form>
        </Container>
    );
};

export default ProfilePage;