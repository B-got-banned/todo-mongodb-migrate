const express = require('express');
require("dotenv").config()
const cors = require('cors');
const logRequest = require('./middlewares/logger') //importing the logger
const validatePost = require("./middlewares/validatePost")//importing the POST method validator
const validatePatch = require("./middlewares/validatePatch")//importing the PATCH method validator
const errorHandler = require("./middlewares/errorHandler")//importing the global error handler
const connectDB = require("./databases/db") //importing the DB connector
const Todo = require("./models/todoModel") //importing the to do schema
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors())


connectDB() //DB connector
app.use(logRequest) //logger for all requests

app.get('/', (req, res) => {
  res.status(200).send("<h1>Welcome to my To do API! Now fully migrated to MongoDB 🥹</h1>")
}
// GET All – Read (As well as GET completed and GET active tasks) (Now MongoDB Migrated and query paramiterized 🥹)
app.get('/todos', async (req, res) => {
  const {completed} = req.query
  const filter = {} //filter to detaermine if to GET all ({}), GET completed ({completed: true}) or GET active ({completed: false})

  if(completed !== undefined) filter.completed = completed === "true"

  const todos = await Todo.find(filter)
  res.status(200).json(todos); // Send array as JSON
});


//GET One - Read One (Now MongoDB Migrated! 🥹)
app.get('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if(!todo){
      return res.status(404).json({error: "To do item does not exist"})
    }
    res.status(200).json(todo)
  } catch (error) {
    next(error)
  }
})

// POST New – Create (Now MongoDB Migrated! 🥹)
app.post('/todos', validatePost, async (req, res, next) => {
  try {
    const {task, completed} = req.body
    const newTodo = new Todo({
      task: task,
      completed: completed
    })
    if(!req.body.task){
      return res.status(400).json({error: "Please include the task! >:("}) //Validation
    }
    await newTodo.save()
    res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error)
  }
});

// PATCH Update – Partial (Now MongoDB Migrated! 🥹)
app.patch('/todos/:id', validatePatch, async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!todo) return res.status(404).json({ error: 'To do item not found' });
    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
});

// DELETE Remove (Now MongoDB Migrated! 🥹)
app.delete('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id)
    if (!todo) return res.status(404).json({ error: 'To do item not found' });
    res.status(200).json({message: `To do item ${req.params.id} has been deleted successfully! :D`});
  } catch (error) {
    next(error)
  }
});

app.use(errorHandler) //global error handler

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
