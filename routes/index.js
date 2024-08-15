const express = require('express')
const router = express.Router()
const todosRouter = require('./todos')

router.use('/todos', todosRouter)

router.get('/', (req, res) => {
    res.redirect('/todos')
})

module.exports = router