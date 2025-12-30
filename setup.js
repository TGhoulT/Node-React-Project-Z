const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Настройка проекта...');

//создаём папку data
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✓ Папка data создана');
}

//запускаем создание таблиц
console.log('Запускаю создание таблиц в БД...');
exec('node create_tables.js', (error, stdout) => {
    if (error) {
        console.error(`Ошибка: ${error}`);
        return;
    }
    console.log(stdout);
    console.log('✓ Настройка завершена!');
    console.log('Запускайте сервер: node server.js');
});