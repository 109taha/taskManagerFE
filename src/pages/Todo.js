import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./Todo.css";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  // 🧭 Fetch all todos on page load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await api.get("/task");
      setTodos(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch todos:", err);
    }
  };

  // 📝 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add new todo
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      const res = await api.post("/task", form);
      setTodos([...todos, res.data]);
      setForm({ title: "", description: "", status: "pending", dueDate: "" });
    } catch (err) {
      console.error("❌ Add failed:", err);
    }
  };

  // 🔄 Update status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/task/${id}`, { status: newStatus });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  // ❌ Delete todo
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/task/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="app">
      <h1>📝 Todo List</h1>
      <button className="logout" onClick={logout}>
        Logout
      </button>

      {/* Add Todo Form */}
      <form className="input-section" onSubmit={handleAdd}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Add</button>
      </form>

      {/* Todo List */}
      <ul className="task-list">
        {todos.length === 0 && <p>No tasks yet. Add one!</p>}
        {todos.map((todo) => (
          <li key={todo._id} className={todo.status}>
            <div className="todo-info">
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <small>
                Due: {todo.dueDate ? todo.dueDate.split("T")[0] : "—"}
              </small>
            </div>

            <div className="todo-actions">
              <select
                value={todo.status}
                onChange={(e) => updateStatus(todo._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <br></br>
              <br></br>
              <button onClick={() => deleteTodo(todo._id)}>DELETE</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
