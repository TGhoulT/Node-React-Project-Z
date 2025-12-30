const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
        return;
    }
    console.log('Подключение к SQLite базе данных установлено.');
    createTables();
});

function createTables() {
    //сериалайз для последовательного выполнения всех операций
    db.serialize(() => {
        //таблица пользователей
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      avatar_color TEXT DEFAULT '#3498db',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
            if (err) {
                console.error('Ошибка создания таблицы users:', err.message);
            } else {
                console.log('Таблица users создана/уже существует');
            }
        });

        //таблица комнат
        db.run(`CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
            if (err) {
                console.error('Ошибка создания таблицы rooms:', err.message);
            } else {
                console.log('Таблица rooms создана/уже существует');
            }
        });

        //таблица сообщений
        db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      room_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    )`, (err) => {
            if (err) {
                console.error('Ошибка создания таблицы messages:', err.message);
            } else {
                console.log('Таблица messages создана/уже существует');
            }
        });

        //ждём пока таблицы не создадутся, потом добавляем данные (была ошибка с добавлением, это исправление её исправило)
        db.wait(() => {
            addTestData();
        });
    });
}

function addTestData() {
    //проверяем и добавляем тестовые данные
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (err) {
            console.error('Ошибка при проверке пользователей:', err.message);
            closeDatabase();
            return;
        }

        if (row.count === 0) {
            console.log('Добавляем тестовых пользователей...');
            const stmt = db.prepare("INSERT INTO users (username, avatar_color) VALUES (?, ?)");

            stmt.run('Алексей', '#3498db');
            stmt.run('Мария', '#e74c3c');
            stmt.run('Иван', '#2ecc71');

            stmt.finalize((err) => {
                if (err) {
                    console.error('Ошибка при добавлении пользователей:', err.message);
                } else {
                    console.log('Тестовые пользователи добавлены');
                }
                checkRooms();
            });
        } else {
            console.log('Пользователи уже существуют, пропускаем...');
            checkRooms();
        }
    });
}

function checkRooms() {
    db.get("SELECT COUNT(*) as count FROM rooms", (err, row) => {
        if (err) {
            console.error('Ошибка при проверке комнат:', err.message);
            closeDatabase();
            return;
        }

        if (row.count === 0) {
            console.log('Добавляем тестовые комнаты...');
            const stmt = db.prepare("INSERT INTO rooms (name, description) VALUES (?, ?)");

            stmt.run('Общий чат', 'Основная комната для общения');
            stmt.run('Флудильня', 'Для неформального общения');
            stmt.run('Техподдержка', 'Вопросы по проекту');

            stmt.finalize((err) => {
                if (err) {
                    console.error('Ошибка при добавлении комнат:', err.message);
                } else {
                    console.log('Тестовые комнаты добавлены');
                }
                checkMessages();
            });
        } else {
            console.log('Комнаты уже существуют, пропускаем...');
            checkMessages();
        }
    });
}

function checkMessages() {
    db.get("SELECT COUNT(*) as count FROM messages", (err, row) => {
        if (err) {
            console.error('Ошибка при проверке сообщений:', err.message);
            closeDatabase();
            return;
        }

        if (row.count === 0) {
            console.log('Добавляем тестовые сообщения...');
            const stmt = db.prepare("INSERT INTO messages (text, author_id, room_id) VALUES (?, ?, ?)");

            stmt.run('Привет всем! Как дела?', 1, 1);
            stmt.run('У меня всё отлично!', 2, 1);
            stmt.run('Напомните, во сколько завтра собрание?', 3, 2);
            stmt.run('В 10:00 в главном кабинете', 1, 2);

            stmt.finalize((err) => {
                if (err) {
                    console.error('Ошибка при добавлении сообщений:', err.message);
                } else {
                    console.log('Тестовые сообщения добавлены');
                }
                closeDatabase();
            });
        } else {
            console.log('Сообщения уже существуют, пропускаем...');
            closeDatabase();
        }
    });
}

function closeDatabase() {
    //немного времени выделим на завершение всех операций
    setTimeout(() => {
        db.close((err) => {
            if (err) {
                console.error('Ошибка закрытия соединения:', err.message);
            } else {
                console.log('Соединение с базой данных закрыто.');
            }
        });
    }, 100);
}