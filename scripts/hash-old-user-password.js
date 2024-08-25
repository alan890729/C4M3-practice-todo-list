const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const db = require('../models')

const { Op } = Sequelize
const User = db.User

return User.findAll({
    attributes: ['id', 'password'],
    where: {
        password: {
            [Op.notLike]: '$2a$10$%'
        }
    },
    raw: true
}).then((users) => {
    console.log(users)

    return Promise.all(
        users.map(user => {
            return bcrypt.hash(user.password, 10).then((hash) => {
                User.update(
                    {
                        password: hash
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                )
            })

        })
    )
})