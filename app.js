const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Parse JSON bodies for POST and PUT requests
app.use(bodyParser.json());

// Sample data - replace with your own database or data source
let todos = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
];

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Get a specific todo
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Create a new todo
app.post('/todos', (req, res) => {
  const newTodo = req.body;
  newTodo.id = todos.length + 1;
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update an existing todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTodo = req.body;
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    todos[index] = { ...todos[index], ...updatedTodo };
    res.json(todos[index]);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    const deletedTodo = todos[index];
    todos.splice(index, 1);
    res.json(deletedTodo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
