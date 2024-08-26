const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

router.get('/login/facebook', passport.authenticate('facebook', {
    scope: ['email']
}))

router.get('/redirect/facebook', passport.authenticate('facebook', {
    successRedirect: '/todos',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router