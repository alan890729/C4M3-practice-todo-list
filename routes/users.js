const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

router.post('/', (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body

    return User.count({
        where: { email }
    }).then((amount) => {
        if(!email || !password) {
            throw new Error('email 及 password 為必填')
        }

        if (password !== confirmPassword) {
            throw new Error('驗證密碼與密碼不符')
        }

        if (amount) {
            throw new Error('email已經註冊過')
        }

        return User.create({
            name,
            email,
            password
        })
    }).then(() => {
        req.flash('success', '註冊成功')
        return res.redirect('/login')
    }).catch((err) => {
        err.errorMessage = err.message
        next(err)
    })
})

module.exports = router