const express = require('express')
const db = require('./models')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const port = 3000
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'MySecret',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

app.get('/', (req, res) => {
    res.redirect('/todos')
})

app.get('/todos', (req, res) => {
    return Todo.findAll({
        attributes: [
            'id',
            'name',
            'isCompleted'
        ],
        raw: true
    }).then((todos) => {
        res.render('todos', {
            todos,
            message: req.flash('success')
        })
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
        req.flash('success', '新增成功!')
        res.redirect('/todos')
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.get('/todos/:id', (req, res) => {
    const todoId = req.params.id

    return Todo.findByPk(todoId, {
        attributes: [
            'id',
            'name',
            'isCompleted'
        ],
        raw: true
    }).then((todo) => {
        res.render('todo', { todo, message: req.flash('success') })
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.get('/todos/:id/edit', (req, res) => {
    const todoId = req.params.id

    return Todo.findByPk(todoId, {
        attributes: [
            'id',
            'name',
            'isCompleted'
        ],
        raw: true
    }).then((todo) => {
        res.render('edit', { todo })
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.put('/todos/:id', (req, res) => {
    const todoId = req.params.id
    const { name, isCompleted } = req.body

    return Todo.update(
        { name, isCompleted: isCompleted === 'on'},
        {
            where: { id: Number(todoId) }
        }
    ).then(() => {
        req.flash('success', '編輯成功!')
        res.redirect(`/todos/${todoId}`)
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.delete('/todos/:id', (req, res) => {
    const todoId = req.params.id

    return Todo.destroy({
        where: {
            id: Number(todoId)
        }
    }).then(() => {
        req.flash('success', '刪除成功!')
        res.redirect('/todos')
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})