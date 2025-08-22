import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-4">
          ✅ Lista de Tarefas
        </h1>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Nova tarefa..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={adicionarTarefa}
            className="bg-pink-600 text-white px-4 rounded-r-lg hover:bg-pink-700"
          >
            Adicionar
          </button>
        </div>

        <ul className="space-y-2">
          {tarefas.map((tarefa) => (
            <li
              key={tarefa.id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border"
            >
              <span
                className={`flex-1 ${
                  tarefa.concluida ? "line-through text-gray-400" : ""
                }`}
              >
                {tarefa.titulo}
              </span>
              <div className="space-x-2">
                {!tarefa.concluida && (
                  <button
                    onClick={() => concluirTarefa(tarefa.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  >
                    Concluir
                  </button>
                )}
                <button
                  onClick={() => removerTarefa(tarefa.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
