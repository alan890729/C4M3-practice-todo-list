const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const router = express.Router()
const todosRouter = require('./todos')
const userRouter = require('./users')
const authHandler = require('../middlewares/auth-handler')
const db = require('../models')
const User = db.User


passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            email: username
        },
        raw: true
    }).then((user) => {
        if (!user || user.password !== password) {
            return done(null, false, { type: 'error', message: 'email 或 password 錯誤' })
        }

        return done(null, user)
    }).catch((err) => {
        err.errorMessage = '登入失敗'
        done(err)
    })
}))

passport.serializeUser((user, done) => {
    const { id, name, email } = user
    return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
    return done(null, { id: user.id })
})

router.use('/todos', authHandler, todosRouter)
router.use('/users', userRouter)

router.get('/', (req, res) => {
    res.redirect('/todos')
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/todos',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        return res.redirect('/login')
    })
})

router.get('/register', (req, res) => {
    return res.render('register')
})

module.exports = router