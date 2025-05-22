import React, { useState, useEffect } from 'react';

const API_URL = 'https://playground.4geeks.com/todo/users/Mjmaria27'; // Reemplaza 'tu_nombre_de_usuario' con tu nombre de usuario real

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Crear usuario y obtener tareas al iniciar
  useEffect(() => {
    // Intentamos crear el usuario (no importa si ya existe)
    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ label: "tarea de ejemplo", done: false }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(() => fetchTasks()) // Luego traemos las tareas reales
    .catch((error) => console.error("Error al crear usuario o cargar tareas:", error));
  }, []);


  const fetchTasks = () => {
    fetch(API_URL)
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch(error => console.error('Error al cargar tareas:', error));
  };

  // Agregar tarea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const newTask = { label: inputValue.trim(), done: false };

      fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(() => {
        fetchTasks();
        setInputValue('');
      })
      .catch(error => console.error('Error al agregar tarea:', error));
    }
  };

  // Eliminar tarea individual
  const deleteTask = (index) => {
    const taskToDelete = tasks[index];

    fetch(`${API_URL}/${taskToDelete.id}`, {
      method: "DELETE"
    })
    .then(() => fetchTasks())
    .catch(error => console.error("Error al eliminar tarea:", error));
  };

  // Eliminar todas las tareas
  const clearAll = () => {
    Promise.all(
      tasks.map(task =>
        fetch(`${API_URL}/${task.id}`, { method: "DELETE" })
      )
    )
    .then(() => fetchTasks())
    .catch(error => console.error("Error al limpiar tareas:", error));
  };

  return (
    <div style={{ maxWidth: 400, margin: '30px auto', fontFamily: "'Montserrat', sans-serif" }}>
      <h2>TO DO LIST</h2>
      <input
        type="text"
        placeholder="Añadir tarea y presiona Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: '100%', padding: '10px', fontSize: '1rem', boxSizing: 'border-box' }}
        autoFocus
      />

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {tasks.map((task, index) => (
          <TaskItem key={task.id} text={task.label} onDelete={() => deleteTask(index)} />
        ))}
      </ul>

      <p style={{ color: '#777', fontStyle: 'italic', textAlign: 'left', marginTop: 20 }}>
        {tasks.length === 0 ? 'No hay tareas, añadir tareas' : `${tasks.length} ${tasks.length === 1 ? 'item' : 'items'} left`}
      </p>

      <button onClick={clearAll} style={{ marginTop: 10, padding: '8px 12px', backgroundColor: '#cc0000', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 5 }}>
        Limpiar todas las tareas
      </button>
    </div>
  );
}

function TaskItem({ text, onDelete }) {
  const [hover, setHover] = useState(false);

  return (
    <li
      style={{
        position: 'relative',
        padding: '10px 40px 10px 10px',
        borderBottom: '1px solid #ddd',
        cursor: 'default',
        userSelect: 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {text}
      {hover && (
        <button
          onClick={onDelete}
          title="Eliminar tarea"
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            color: '#cc0000',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      )}
    </li>
  );
}
