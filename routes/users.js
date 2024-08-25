const express = require('express')
const bcrypt = require('bcryptjs')
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

        return bcrypt.hash(password, 10)
    }).then((hash) => {
        return User.create({
            name,
            email,
            password: hash
        })
    }).then(() => {
        req.flash('success', '註冊成功')
        return res.redirect('/login')
    }).catch((err) => {
        err.errorMessage = err.message || '註冊失敗'
        next(err)
    })
})

module.exports = router