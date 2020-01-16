/* eslint-disable strict */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 8000;
const todoRoutes = express.Router();
let Todo = require('./todo.model');

const app = express();

// const morganOption = (NODE_ENV === 'production')
//   ? 'tiny'
//   : 'common';

app.use(cors());
app.use(helmet());
// app.use(morgan(morganOption));
app.use(bodyParser.json());

mongoose.connect('mongodb://aldibatyr:Test123@ds263808.mlab.com:63808/heroku_b7qxp2th', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

todoRoutes.route('/').get((req, res) => {
  Todo.find((err, todos) => {
    err ? console.log(err) : res.json(todos);
  });
});

todoRoutes.route('/:id').get((req, res) => {
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    err ? console.log(err) : res.json(todo);
  });
});

todoRoutes.route('/add').post((req, res) => {
  let todo = new Todo(req.body);
  todo.save()
    .then((todo => {
      res.status(200).json({ 'todo': 'todo added successfully' });
    }))
    .catch(err => {
      res.status(400).send('failed to add new todo');
    });
});

todoRoutes.route('/update/:id').post((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo)
      res.status(404).send('todo is not found');
    else
      todo.description = req.body.description;
    todo.priority = req.body.priority;
    todo.responsible = req.body.responsible;
    todo.completed = req.body.completed;
    
    todo.save().then(todo => {
      res.json('todo updated!');
    })
      .catch(err => {
        res.status(400).send('Update failed, try again');
      });

  });
});

app.use('/todos', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

