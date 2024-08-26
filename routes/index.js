const express = require('express')

const router = express.Router()
const rootRouter = require('./root')
const todosRouter = require('./todos')
const userRouter = require('./users')
const oauth2Router = require('./oauth2')
const authHandler = require('../middlewares/auth-handler')

router.use('/', rootRouter)
router.use('/todos', authHandler, todosRouter)
router.use('/users', userRouter)
router.use('/oauth2', oauth2Router)

module.exports = router