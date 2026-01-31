const express = require('express');
require("dotenv").config()
const cors = require('cors');
const logRequest = require('./middlewares/logger') //importing the logger
const validatePost = require("./middlewares/validatePost")//importing the POST method validator
const validatePatch = require("./middlewares/validatePatch")//importing the PATCH method validator
const errorHandler = require("./middlewares/errorHandler")//importing the global error handler
const connectDB = require("./databases/db") //importing the DB connector
const Todo = require("./models/todoModel") //importing the todo schema
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors())


connectDB() //DB connector
app.use(logRequest) //logger for all requests

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// GET Completed
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

// Get Active
app.get('/todos/active', (req, res) => {
  const activeTasks = todos.filter(a => !a.completed)
  res.status(200).json(activeTasks)
})

//GET One - Read One
app.get('/todos/:id', (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id)
    if(isNaN(id)) throw new Error("Invalid ID")
    const task = todos.find(t => t.id === id)
    if(!task){
      return res.status(404).json({message: "Task does not exist"})
    }
    res.status(200).json(task)
    
  } catch (error) {
    next(error)
  }
})

// POST New – Create
app.post('/todos', validatePost, (req, res, next) => {
  try {
    const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
    if(!req.body.task){
      return res.status(400).json({message: "Please include the task! >:("}) //Validation
    }
    todos.push(newTodo);
    res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error)
  }
});

// PATCH Update – Partial
app.patch('/todos/:id', validatePatch, (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === Number.parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    Object.assign(todo, req.body); // Merge: e.g., {completed: true}
    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
});

// DELETE Remove
app.delete('/todos/:id', (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
    if (todos.length === initialLength)
      return res.status(404).json({ error: 'Not found' });
    res.status(204).send(); // Silent success
  } catch (error) {
    next(error)
  }
});


app.use(errorHandler) //global error handler

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
