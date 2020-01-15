/* eslint-disable strict */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
  description: String,
  responsible: String,
  priority: String,
  completed: Boolean
});

module.exports = mongoose.model('Todo', Todo);