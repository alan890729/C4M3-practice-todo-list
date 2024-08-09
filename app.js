const express = require('express')
const db = require('./models')
const { engine } = require('express-handlebars')

const app = express()
const port = 3000
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/todos', (req, res) => {
    return Todo.findAll({
        attributes: [
            'id',
            'name'
        ],
        raw: true
    }).then((todos) => {
        res.render('todos', { todos })
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.get('/todos/new', (req, res) => {
    res.render('new')
})

app.post('/todos', (req, res) => {
    const { name } = req.body

    return Todo.create({ name }).then(() => {
        res.redirect('/todos')
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.get('/todos/:id', (req, res) => {
    const todoId = req.params.id
    res.send(`
        <p>GET /todos/${todoId}</p>
        <p>A specific todo in todos, this is todo id: ${todoId}</p>    
    `)
})

app.get('/todos/:id/edit', (req, res) => {
    const todoId = req.params.id
    res.send(`
        <p>GET /todos/${todoId}/edit</p>
        <p>This is a page use for edit a todo in todos. You now editting todo id: ${todoId}</p>
    `)
})

app.put('/todos/:id', (req, res) => {
    const todoId = req.params.id
    res.send(`
        <p>PUT /todos/${todoId}</p>
        <p>todo id: ${todoId} has been modified</p>
    `)
})

app.delete('/todos/:id', (req, res) => {
    const todoId = req.params.id
    res.send(`
        <p>DELETE /todos/${todoId}</p>   
        <p>todo id: ${todoId} has been deleted</p> 
    `)
})

app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})