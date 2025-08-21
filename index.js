const express = require("express");
const app = express();
app.use(express.json());

let tarefas = [];     // armazenamento

// rota inicial
app.get("/", (req, res) => {
    res.send("API de tarefas funcionando!");
})

// listar tarefas
app.get("/tarefas", (req, res) => {
    res.json(tarefas);
});

// Criar tarefa
app.post("/tarefas", (req, res) => {
    const { titulo } = req.body;
    const novaTarefa = { id: tarefas.length + 1, titulo, concluida: false };
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
})


// marcar como concluida
app.put("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    const tarefa = tarefas.find(t => t.id == id);
    if (!tarefa) {
        return res.status(404).json({
            erro: "tarefa não encontrada"
        });
    }

    tarefa.concluida = true;
    res.json(tarefa);
})

// deletar tarefa
app.delete("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    tarefas = tarefas.filter(t => t.id != id);
    res.json({
        mensagem: "Tarefa removida"
    });
})

// rodar servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000")
})