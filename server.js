const express = require('express');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

//создаём новое сообщение
app.post('/api/messages', async (req, res) => {
    try {
        const { text, authorId, roomId } = req.body;

        //валидация
        if (!text || !authorId || !roomId) {
            return res.status(400).json({
                error: 'Необходимо указать text, authorId и roomId'
            });
        }

        const result = await db.messages.create(text, authorId, roomId);

        //получаем сообщение с доп. инф.
        const message = await db.messages.getById(result.id);

        res.status(201).json({
            success: true,
            message: 'Сообщение создано',
            data: message
        });
    } catch (error) {
        console.error('Ошибка при создании сообщения:', error);
        res.status(500).json({
            error: 'Ошибка сервера при создании сообщения'
        });
    }
});

//получаем все сообщения
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await db.messages.getAll();
        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
        res.status(500).json({
            error: 'Ошибка сервера при получении сообщений'
        });
    }
});

//поулчаем одно сообщение по id
app.get('/api/messages/:id', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);

        if (isNaN(messageId)) {
            return res.status(400).json({
                error: 'Некорректный ID сообщения'
            });
        }

        const message = await db.messages.getById(messageId);

        if (!message) {
            return res.status(404).json({
                error: 'Сообщение не найдено'
            });
        }

        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Ошибка при получении сообщения:', error);
        res.status(500).json({
            error: 'Ошибка сервера при получении сообщения'
        });
    }
});

//получаем сообщения по комнате
app.get('/api/rooms/:roomId/messages', async (req, res) => {
    try {
        const roomId = parseInt(req.params.roomId);

        if (isNaN(roomId)) {
            return res.status(400).json({
                error: 'Некорректный ID комнаты'
            });
        }

        const messages = await db.messages.getByRoom(roomId);

        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Ошибка при получении сообщений комнаты:', error);
        res.status(500).json({
            error: 'Ошибка сервера при получении сообщений комнаты'
        });
    }
});

//удалить сообщение по id
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);

        if (isNaN(messageId)) {
            return res.status(400).json({
                error: 'Некорректный ID сообщения'
            });
        }

        // Проверяем, существует ли сообщение
        const message = await db.messages.getById(messageId);
        if (!message) {
            return res.status(404).json({
                error: 'Сообщение не найдено'
            });
        }

        // Удаляем сообщение
        const result = await db.messages.remove(messageId);

        res.json({
            success: true,
            message: `Сообщение с ID ${messageId} удалено`,
            data: result
        });
    } catch (error) {
        console.error('Ошибка при удалении сообщения:', error);
        res.status(500).json({
            error: 'Ошибка сервера при удалении сообщения: ' + error.message
        });
    }
});

//обновить сообщение по id (patch)
app.patch('/api/messages/:id', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);

        if (isNaN(messageId)) {
            return res.status(400).json({
                error: 'Некорректный ID сообщения'
            });
        }

        //проверяем, существует ли сообщение
        const existingMessage = await db.messages.getById(messageId);
        if (!existingMessage) {
            return res.status(404).json({
                error: 'Сообщение не найдено'
            });
        }

        //проверяем тело запроса
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Тело запроса пустое. Укажите поля для обновления (text, authorId, roomId)'
            });
        }

        //подготавливаем данные для обновления
        const updates = {};
        if (req.body.text !== undefined) updates.text = req.body.text;
        if (req.body.authorId !== undefined) updates.author_id = req.body.authorId;
        if (req.body.roomId !== undefined) updates.room_id = req.body.roomId;

        //если нет полей для обновления
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: 'Нет допустимых полей для обновления. Допустимые поля: text, authorId, roomId'
            });
        }

        const result = await db.messages.update(messageId, updates);

        const updatedMessage = await db.messages.getById(messageId);

        res.json({
            success: true,
            message: `Сообщение с ID ${messageId} обновлено`,
            data: updatedMessage,
            changes: result
        });
    } catch (error) {
        console.error('Ошибка при обновлении сообщения:', error);
        res.status(500).json({
            error: 'Ошибка сервера при обновлении сообщения: ' + error.message
        });
    }
});


//получаем всех пользователей
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.users.getAll();
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({
            error: 'Ошибка сервера при получении пользователей'
        });
    }
});

//получаем одного пользователя по ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({
                error: 'Некорректный ID пользователя'
            });
        }

        const user = await db.users.getById(userId);

        if (!user) {
            return res.status(404).json({
                error: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        res.status(500).json({
            error: 'Ошибка сервера при получении пользователя: ' + error.message
        });
    }
});

//удалить пользователя по id
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({
                error: 'Некорректный ID пользователя'
            });
        }

        //проверяем на существование
        const user = await db.users.getById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'Пользователь не найден'
            });
        }

        const result = await db.users.remove(userId);

        res.json({
            success: true,
            message: `Пользователь с ID ${userId} удален`,
            data: result
        });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({
            error: 'Ошибка сервера при удалении пользователя: ' + error.message
        });
    }
});

//обновить пользователя по id (patch)
app.patch('/api/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({
                error: 'Некорректный ID пользователя'
            });
        }

        //проверяем на существование
        const existingUser = await db.users.getById(userId);
        if (!existingUser) {
            return res.status(404).json({
                error: 'Пользователь не найден'
            });
        }

        //проверяем тело запроса
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Тело запроса пустое. Укажите поля для обновления (username, avatarColor)'
            });
        }

        const updates = {};
        if (req.body.username !== undefined) updates.username = req.body.username;
        if (req.body.avatarColor !== undefined) updates.avatar_color = req.body.avatarColor;

        //если нет полей для обновления
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: 'Нет допустимых полей для обновления. Допустимые поля: username, avatarColor'
            });
        }

        const result = await db.users.update(userId, updates);

        const updatedUser = await db.users.getById(userId);

        res.json({
            success: true,
            message: `Пользователь с ID ${userId} обновлен`,
            data: updatedUser,
            changes: result
        });
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        res.status(500).json({
            error: 'Ошибка сервера при обновлении пользователя: ' + error.message
        });
    }
});

//получаем все комнаты
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await db.rooms.getAll();
        res.json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        console.error('Ошибка при получении комнат:', error);
        res.status(500).json({
            error: 'Ошибка сервера при получении комнат'
        });
    }
});

//получаем одну комнату по ID
app.get('/api/rooms/:id', async (req, res) => {
    try {
        const roomId = parseInt(req.params.id);

        if (isNaN(roomId)) {
            return res.status(400).json({
                error: 'Некорректный ID комнаты'
            });
        }

        const room = await db.rooms.getById(roomId);

        if (!room) {
            return res.status(404).json({
                error: 'Комната не найдена'
            });
        }

        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        console.error('Ошибка при получении комнаты:', error);
        res.status(500).json({
            error: 'Ошибка сервера при получении комнаты: ' + error.message
        });
    }
});

app.delete('/api/rooms/:id', async (req, res) => {
    try {
        const roomId = parseInt(req.params.id);

        if (isNaN(roomId)) {
            return res.status(400).json({
                error: 'Некорректный ID комнаты'
            });
        }

        //проверяем на существование
        const room = await db.rooms.getById(roomId);
        if (!room) {
            return res.status(404).json({
                error: 'Комната не найдена'
            });
        }

        //удаляем
        const result = await db.rooms.remove(roomId);

        res.json({
            success: true,
            message: `Комната с ID ${roomId} удалена`,
            data: result
        });
    } catch (error) {
        console.error('Ошибка при удалении комнаты:', error);
        res.status(500).json({
            error: 'Ошибка сервера при удалении комнаты: ' + error.message
        });
    }
});

//обновить комнату по id (patch)
app.patch('/api/rooms/:id', async (req, res) => {
    try {
        const roomId = parseInt(req.params.id);

        if (isNaN(roomId)) {
            return res.status(400).json({
                error: 'Некорректный ID комнаты'
            });
        }

        //проверяем на существование
        const existingRoom = await db.rooms.getById(roomId);
        if (!existingRoom) {
            return res.status(404).json({
                error: 'Комната не найдена'
            });
        }

        //проверяем тело запроса
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Тело запроса пустое. Укажите поля для обновления (name, description)'
            });
        }

        const updates = {};
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.description !== undefined) updates.description = req.body.description;

        //если нет полей для обновления
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: 'Нет допустимых полей для обновления. Допустимые поля: name, description'
            });
        }

        const result = await db.rooms.update(roomId, updates);

        const updatedRoom = await db.rooms.getById(roomId);

        res.json({
            success: true,
            message: `Комната с ID ${roomId} обновлена`,
            data: updatedRoom,
            changes: result
        });
    } catch (error) {
        console.error('Ошибка при обновлении комнаты:', error);
        res.status(500).json({
            error: 'Ошибка сервера при обновлении комнаты: ' + error.message
        });
    }
});

//корневой маршрут для проверки работает сервер или нет
app.get('/', (req, res) => {
    res.json({
        message: 'API мессенджера работает!',
        endpoints: {
            messages: {
                create: 'POST /api/messages',
                getAll: 'GET /api/messages',
                getOne: 'GET /api/messages/:id',
                getByRoom: 'GET /api/rooms/:roomId/messages',
                update: 'PATCH /api/messages/:id',
                delete: 'DELETE /api/messages/:id'
            },
            users: {
                getAll: 'GET /api/users',
                getOne: 'GET /api/users/:id',
                update: 'PATCH /api/users/:id',
                delete: 'DELETE /api/users/:id'
            },
            rooms: {
                getAll: 'GET /api/rooms',
                getOne: 'GET /api/rooms/:id',
                update: 'PATCH /api/rooms/:id',
                delete: 'DELETE /api/rooms/:id'
            }
        }
    });
});

//обработка несуществуюих мащрутов
app.use((req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден'
    });
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Доступные маршруты:');
    console.log('  GET  / - информация об API');
    console.log('\n===== СООБЩЕНИЯ =====');
    console.log('  POST /api/messages  -  создать сообщение');
    console.log('  GET  /api/messages  -  все сообщения');
    console.log('  GET  /api/messages/:id  -  сообщение по ID');
    console.log('  GET  /api/rooms/:roomId/messages  -  сообщения комнаты');
    console.log('  PATCH  /api/messages/:id  -  обновить сообщение');
    console.log('  DELETE /api/messages/:id  -  удалить сообщение');
    console.log('\n===== ПОЛЬЗОВАТЕЛИ =====');
    console.log('  GET  /api/users  -  все пользователи');
    console.log('  GET  /api/users/:id  -  пользователь по ID');
    console.log('  PATCH  /api/users/:id  -  обновить пользователя');
    console.log('  DELETE /api/users/:id  -  удалить пользователя');
    console.log('\n===== КОМНАТЫ =====');
    console.log('  GET  /api/rooms  -  все комнаты');
    console.log('  GET    /api/rooms/:id  -  комната по ID');
    console.log('  PATCH  /api/rooms/:id  -  обновить комнату');
    console.log('  DELETE /api/rooms/:id  -  удалить комнату');
});