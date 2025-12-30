const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');

//подключаемся
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    }
});

//для обертки запросов в промисы
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


function runInsert(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
}


const messages = {
    //создаём новое сообщение
    async create(text, authorId, roomId) {
        const sql = `INSERT INTO messages (text, author_id, room_id) VALUES (?, ?, ?)`;
        return await runInsert(sql, [text, authorId, roomId]);
    },

    //получаем все сообщения с инф. об авторе
    async getAll() {
        const sql = `
      SELECT 
        m.*,
        u.username,
        u.avatar_color,
        r.name as room_name
      FROM messages m
      JOIN users u ON m.author_id = u.id
      JOIN rooms r ON m.room_id = r.id
      ORDER BY m.created_at DESC
    `;
        return await runQuery(sql);
    },

    //по id
    async getById(id) {
        const sql = `
      SELECT 
        m.*,
        u.username,
        u.avatar_color,
        r.name as room_name
      FROM messages m
      JOIN users u ON m.author_id = u.id
      JOIN rooms r ON m.room_id = r.id
      WHERE m.id = ?
    `;
        const result = await runQuery(sql, [id]);
        return result[0] || null;
    },

    //по комнате
    async getByRoom(roomId) {
        const sql = `
      SELECT 
        m.*,
        u.username,
        u.avatar_color
      FROM messages m
      JOIN users u ON m.author_id = u.id
      WHERE m.room_id = ?
      ORDER BY m.created_at ASC
    `;
        return await runQuery(sql, [roomId]);
    },

    // Удалить сообщение по ID
    async remove(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM messages WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
            });
        });
    },

    //обновить сообщение по ID
    async update(id, updates) {
        //updates - объект с полями для обновления, пример - { text: 'Новый Год близко' }
        const allowedFields = ['text', 'author_id', 'room_id'];
        const fieldsToUpdate = Object.keys(updates).filter(field =>
            allowedFields.includes(field)
        );

        if (fieldsToUpdate.length === 0) {
            throw new Error('Нет полей для обновления');
        }

        const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
        const values = fieldsToUpdate.map(field => updates[field]);
        values.push(id); //для условия WHERE

        const sql = `UPDATE messages SET ${setClause} WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.run(sql, values, function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes, id: id });
            });
        });
    }
};

//для работы с пользователем
const users = {
    async getAll() {
        const sql = `SELECT * FROM users ORDER BY username`;
        return await runQuery(sql);
    },

    async getById(id) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        const result = await runQuery(sql, [id]);
        return result[0] || null;
    },

    async create(username, avatarColor = '#3498db') {
        const sql = `INSERT INTO users (username, avatar_color) VALUES (?, ?)`;
        return await runInsert(sql, [username, avatarColor]);
    },

    async remove(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM users WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
            });
        });
    },

    async update(id, updates) {
        const allowedFields = ['username', 'avatar_color'];
        const fieldsToUpdate = Object.keys(updates).filter(field =>
            allowedFields.includes(field)
        );

        if (fieldsToUpdate.length === 0) {
            throw new Error('Нет полей для обновления');
        }

        const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
        const values = fieldsToUpdate.map(field => updates[field]);
        values.push(id);

        const sql = `UPDATE users SET ${setClause} WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.run(sql, values, function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes, id: id });
            });
        });
    }
};

//для работы с комнатами
const rooms = {
    async getAll() {
        const sql = `SELECT * FROM rooms ORDER BY name`;
        return await runQuery(sql);
    },

    async getById(id) {
        const sql = `SELECT * FROM rooms WHERE id = ?`;
        const result = await runQuery(sql, [id]);
        return result[0] || null;
    },

    async create(name, description = '') {
        const sql = `INSERT INTO rooms (name, description) VALUES (?, ?)`;
        return await runInsert(sql, [name, description]);
    },

    async remove(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM rooms WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
            });
        });
    },

    async update(id, updates) {
        const allowedFields = ['name', 'description'];
        const fieldsToUpdate = Object.keys(updates).filter(field =>
            allowedFields.includes(field)
        );

        if (fieldsToUpdate.length === 0) {
            throw new Error('Нет полей для обновления');
        }

        const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
        const values = fieldsToUpdate.map(field => updates[field]);
        values.push(id);

        const sql = `UPDATE rooms SET ${setClause} WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.run(sql, values, function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes, id: id });
            });
        });
    }
};

module.exports = {
    messages,
    users,
    rooms,
    db
};