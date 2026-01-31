const express = require('express');
const cors = require('cors');
const logRequest = require('./middlewares/logger') //importing the logger
const validatePost = require("./middlewares/validatePost")//importing the POST method validator
const validatePatch = require("./middlewares/validatePatch")//importing the PATCH method validator
const errorHandler = require("./middlewares/errorHandler")//importing the global error handler
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors())

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Do the laundry', completed: false },
  { id: 4, task: "Get a good night's sleep", completed: false },
];

app.use(logRequest) //logger for all requests

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});


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

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

//Former basic global error handler
// app.use((err, req, res, next) => {
//   res.status(500).json({ error: 'Server error!' });
// });


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

//Array Bonus!
app.get('/todos/active', (req, res) => {
  const activeTasks = todos.filter(a => !a.completed)
  res.status(200).json(activeTasks)
})

app.use(errorHandler) //global error handler

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
