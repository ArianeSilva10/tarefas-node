import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");

  // carregar tarefas ao iniciar
  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    const res = await axios.get("http://localhost:3000/tarefas");
    setTarefas(res.data);
  };

  const adicionarTarefa = async () => {
    if (!titulo) return;
    await axios.post("http://localhost:3000/tarefas", { titulo });
    setTitulo("");
    carregarTarefas();
  };

  const concluirTarefa = async (id) => {
    await axios.put(`http://localhost:3000/tarefas/${id}`);
    carregarTarefas();
  };

  const removerTarefa = async (id) => {
    await axios.delete(`http://localhost:3000/tarefas/${id}`);
    carregarTarefas();
  };

  return (
    <div style={{ margin: "30px", fontFamily: "Arial" }}>
      <h1>✅ Lista de Tarefas</h1>

      <input
        type="text"
        placeholder="Nova tarefa..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button onClick={adicionarTarefa}>Adicionar</button>

      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id}>
            <span
              style={{
                textDecoration: tarefa.concluida ? "line-through" : "none",
                marginRight: "10px",
              }}
            >
              {tarefa.titulo}
            </span>
            {!tarefa.concluida && (
              <button onClick={() => concluirTarefa(tarefa.id)}>
                Concluir
              </button>
            )}
            <button onClick={() => removerTarefa(tarefa.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
