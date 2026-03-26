require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log("Mongo error:", err));

// Schema
const TodoSchema = new mongoose.Schema({
  text: String,
  deadline: Date,
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model("Todo", TodoSchema);

// GET all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add todo
app.post("/todos", async (req, res) => {
  try {
    const { text, deadline } = req.body;

    const todo = new Todo({
      text,
      deadline: deadline ? new Date(deadline) : null
    });

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));