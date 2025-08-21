const sqlite3 = require("sqlite3").verbose();

const  db = new sqlite3.Database("tarefas.db");

// cria a tabela se não existir

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            titulo TEXT NOT NULL,
            concluida INTEGER DEFAULT 0
        )
        `);
});

module.exports = db;