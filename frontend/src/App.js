import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/todos");
      setTodos(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  const addTodo = async () => {
    if (!text.trim() || !deadline) return;

    try {
      await axios.post("http://127.0.0.1:5000/todos", {
        text,
        deadline
      });
      setText("");
      setDeadline("");
      fetchTodos();
    } catch (err) {
      console.log("ADD ERROR:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // Reminder system (runs every 1 min)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      todos.forEach((t) => {
        if (t.deadline && new Date(t.deadline) < now) {
          alert(`⏰ Task "${t.text}" is overdue!`);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container">
      <h1>🚀 DevOps Todo App</h1>

      <div className="input-box">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter task..."
        />

        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button onClick={addTodo}>Add</button>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty">No tasks yet 👀</p>
        ) : (
          todos.map((t) => {
            const isOverdue =
              t.deadline && new Date(t.deadline) < new Date();

            return (
              <div
                className="todo-item"
                key={t._id}
                style={{
                  border: isOverdue ? "1px solid red" : "none"
                }}
              >
                <div>
                  <span>{t.text}</span>
                  <br />
                  <small>
                    Deadline:{" "}
                    {t.deadline
                      ? new Date(t.deadline).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata"
                        })
                      : "Not set"}
                  </small>
                </div>

                <button onClick={() => deleteTodo(t._id)}>❌</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;