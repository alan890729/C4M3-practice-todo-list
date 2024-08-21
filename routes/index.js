const express = require('express')
const router = express.Router()
const todosRouter = require('./todos')
const userRouter = require('./users')

router.use('/todos', todosRouter)
router.use('/users', userRouter)

router.get('/', (req, res) => {
    res.redirect('/todos')
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.post('/login', (req, res) => {
    return res.send(req.body)
})

router.post('/logout', (req, res) => {
    return res.send('on route: POST /users/logout, user logging out')
})

router.get('/register', (req, res) => {
    return res.render('register')
})

module.exports = router