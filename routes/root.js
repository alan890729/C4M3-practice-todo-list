const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

router.get('/', (req, res) => {
    res.render('index')
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