const fs = require("fs");
const express = require("express");
const db = require("./db");
const { json } = require("stream/consumers");
const app = express();
const cors = require("cors");
app.use(cors()); // libera todas as origens
app.use(express.json());


const FILE_PATH = "tarefas.json";
let tarefas = []; // armazenamento

// carregar tarefas do arquivo ao iniciar
function carregarTarefas() {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    tarefas = JSON.parse(data);
  }
}

// salvar tarefas no arquivo
function salvarTarefas() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tarefas, null, 2));
}
// rota inicial
app.get("/", (req, res) => {
  res.send("API de tarefas funcionando!");
});

// listar tarefas
app.get("/tarefas", (req, res) => {
  db.all("SELECT * FROM tarefas", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// Criar tarefa
app.post("/tarefas", (req, res) => {
  const { titulo } = req.body;
  db.run("INSERT INTO tarefas (titulo) VALUES (?)", [titulo], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ id: this.lastID, titulo, concluida: 0 });
  });
});

// marcar como concluida
app.put("/tarefas/:id", (req, res) => {
  const { id } = req.params;
  db.run("UPDATE tarefas SET concluida = 1 WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    if (this.changes === 0) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json({ id, concluida: 1 });
  });
});

// deletar tarefa
app.delete("/tarefas/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tarefas WHERE id = ?", [id], function(err){
    if(err){
        return res.status(500).json({ erro: err.message });
    }
    if (this.changes === 0) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json({ mensagem: "Tarefa removida" });
  });
});

carregarTarefas();
// rodar servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
