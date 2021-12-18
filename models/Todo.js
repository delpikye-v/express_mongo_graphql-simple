const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Todo = new Schema({
    name: String,
    description: String,
    completed: Boolean
})

module.exports = mongoose.model('todos', Todo)