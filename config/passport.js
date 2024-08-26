const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')

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
        if (!user) {
            return done(null, false, { type: 'error', message: 'email 或 password 錯誤' })
        }

        return bcrypt.compare(password, user.password).then((isMatched) => {
            if (!isMatched) {
                return done(null, false, { type: 'error', message: 'email 或 password 錯誤' })
            }

            return done(null, user)
        })
    }).catch((err) => {
        err.errorMessage = '登入失敗'
        done(err)
    })
}))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['email', 'displayName'] // profileFields是指profile要呈現的內容，不特別註明會有default呈現的內容。如果沒寫email就算有請求email也會看不到，因為eamils不再default呈現的內容中；但如果註明了任何東西，profile就只會顯示出特別註明的內容，所以這邊才要寫email和displayName，這兩項資訊我們要。
}, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value // 可以先console.log(profile)，看一下profile的結構才知道要怎麼取資料
    const name = profile.displayName

    User.findOne({
        attributes: ['id', 'name', 'email'],
        where: { email },
        raw: true
    }).then((user) => {
        if (user) {
            return done(null, user)
        }

        const randomPwd = Math.random().toString(36).slice(-8)

        bcrypt.hash(randomPwd, 10).then((hash) => {
            return User.create({
                name,
                email,
                password: hash,
            })
        }).then((user) => {
            return done(null, { id: user.id, name: user.name, email: user.email })
        })
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
    return done(null, { id: user.id }) // 從session取出id, 指派給req.user的id，之後如果還在登入狀態下，任何路由都可以使用req.user這個物件，以目前情況為例，req.user裡有id這個property，代表著目前登入者在這個app的資料庫的使用者編號
})

module.exports = passport