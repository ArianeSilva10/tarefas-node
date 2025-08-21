const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());

const FILE_PATH = "tarefas.json";
let tarefas = [];     // armazenamento

// carregar tarefas do arquivo ao iniciar
function carregarTarefas(){
    if (fs.existsSync(FILE_PATH)) {
        const data = fs.readFileSync(FILE_PATH, "utf-8");
        tarefas = JSON.parse(data);
    }
}

// salvar tarefas no arquivo
function salvarTarefas(){
    fs.writeFileSync(FILE_PATH, JSON.stringify(tarefas, null, 2));
}
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
    salvarTarefas();
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
    salvarTarefas();
    res.json(tarefa);
})

// deletar tarefa
app.delete("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    tarefas = tarefas.filter(t => t.id != id);
    salvarTarefas();
    res.json({
        mensagem: "Tarefa removida"
    });
})

carregarTarefas();
// rodar servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000")
})