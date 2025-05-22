import React, { useState, useEffect } from 'react';

const API_URL = "https://assets.breatheco.de/apis/fake/todos/user/mjmaria27";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskLabel, setTaskLabel] = useState('');

  // Crear usuario al iniciar la app
  const createUser = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
      });
      if (response.ok) {
        console.log("✅ Usuario creado");
      } else if (response.status === 400) {
        console.log("ℹ️ El usuario ya existe");
      } else {
        console.error("❌ Error al crear usuario:", response.status);
      }
    } catch (error) {
      console.error("❌ Error en createUser:", error);
    }
  };

  // Cargar tareas existentes
  const getTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("❌ Error al obtener tareas:", response.status);
      }
    } catch (error) {
      console.error("❌ Error en getTasks:", error);
    }
  };

  // Actualizar tareas en el servidor
  const updateTasks = async (newTasks) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTasks)
      });
      if (!response.ok) {
        console.error("❌ Error al actualizar tareas:", response.status);
      }
    } catch (error) {
      console.error("❌ Error en updateTasks:", error);
    }
  };

  // Agregar nueva tarea
  const addTask = () => {
    if (taskLabel.trim() === "") return;

    const newTasks = [...tasks, { label: taskLabel, done: false }];
    setTasks(newTasks);
    updateTasks(newTasks);
    setTaskLabel('');
  };

  // Eliminar una tarea
  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    updateTasks(newTasks);
  };

  useEffect(() => {
    createUser().then(getTasks);
  }, []);

  return (
    <div className="todo-container">
      <h1>📝 To Do List</h1>
      <input
        value={taskLabel}
        onChange={(e) => setTaskLabel(e.target.value)}
        placeholder="Escribe una tarea"
      />
      <button onClick={addTask}>Agregar</button>
      <ul>
        {tasks.map((task, i) => (
          <li key={i}>
            {task.label}
            <button onClick={() => deleteTask(i)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
