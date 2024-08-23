const express = require('express')
const db = require('../models')

const router = express.Router()
const Todo = db.Todo

router.get('/', (req, res, next) => {
    const currentPage = Number(req.query.page) || 1
    const limit = 10
    const userId = req.user.id

    return Todo.count().then((amount) => {

        const totalPage = amount % limit ? Math.ceil(amount / limit) : amount / limit
        res.locals.currentPage = currentPage
        res.locals.totalPage = totalPage
        res.locals.prevPage = currentPage - 1 ? currentPage - 1 : currentPage
        res.locals.nextPage = currentPage === totalPage ? currentPage : currentPage + 1
    }).then(() => {
        return Todo.findAll({
            attributes: [
                'id',
                'name',
                'isCompleted'
            ],
            where: { userId },
            limit,
            offset: (currentPage - 1) * 10,
            raw: true
        })
    }).then((todos) => {
        return res.render('todos', { todos })
    }).catch((err) => {
        err.errorMessage = '取得資料失敗!!'
        next(err)
    })
})

router.get('/new', (req, res) => {
    return res.render('new')
})

router.post('/', (req, res, next) => {
    const { name } = req.body
    const userId = req.user.id

    return Todo.create({
        name,
        userId
    }).then(() => {
        req.flash('success', '新增成功!')
        return res.redirect('/todos')
    }).catch((err) => {
        err.errorMessage = '新增失敗!!'
        next(err)
    })
})

router.get('/:id', (req, res, next) => {
    const todoId = req.params.id
    const userId = req.user.id

    return Todo.findByPk(todoId, {
        attributes: [
            'id',
            'name',
            'isCompleted',
            'userId'
        ],
        raw: true
    }).then((todo) => {
        if (!todo) {
            req.flash('error', '找不到資料')
            return res.redirect('/todos')
        }

        if (todo.userId !== userId) {
            req.flash('error', '沒有權限')
            return res.redirect('/todos')
        }

        return res.render('todo', { todo })
    }).catch((err) => {
        err.errorMessage = '取得資料失敗!!'
        next(err)
    })

})

router.get('/:id/edit', (req, res, next) => {
    const todoId = req.params.id
    const userId = req.user.id

    return Todo.findByPk(todoId, {
        attributes: [
            'id',
            'name',
            'isCompleted',
            'userId'
        ],
        raw: true
    }).then((todo) => {
        if (!todo) {
            req.flash('error', '找不到資料')
            return res.redirect('/todos')
        }

        if (todo.userId !== userId) {
            req.flash('error', '沒有權限')
            return res.redirect('/todos')
        }

        return res.render('edit', { todo })
    }).catch((err) => {
        err.errorMessage = '取得編輯頁失敗!!'
        next(err)
    })
})

router.put('/:id', (req, res, next) => {
    const todoId = req.params.id
    const { name, isCompleted } = req.body
    const userId = req.user.id

    return Todo.findByPk(todoId, {
        attributes: [
            'id',
            'name',
            'isCompleted',
            'userId'
        ]
    }).then((todo) => {
        if (!todo) {
            req.flash('error', '找不到資料')
            return res.redirect('/todos')
        }

        if (todo.userId !== userId) {
            req.flash('error', '沒有權限')
            return res.redirect('/todos')
        }

        return todo.update(
            {
                name,
                isCompleted: isCompleted === 'on'
            }
        )
    }).then(() => {
        req.flash('success', '編輯成功!')
        return res.redirect(`/todos/${todoId}`)
    }).catch((err) => {
        err.errorMessage = '編輯失敗!!'
        next(err)
    })
})

router.delete('/:id', (req, res, next) => {
    const todoId = req.params.id
    const userId = req.user.id

    return Todo.findByPk(todoId, {
        attributes: ['id', 'userId']
    }).then((todo) => {
        if (!todo) {
            req.flash('error', '找不到資料')
            return res.redirect('/todos')
        }

        if (todo.userId !== userId) {
            req.flash('error', '沒有權限')
            return res.redirect('/todos')
        }

        return todo.destroy()
    }).then(() => {
        req.flash('success', '刪除成功!')
        return res.redirect('/todos')
    }).catch((err) => {
        err.errorMessage = '刪除失敗!!'
        next(err)
    })
})

module.exports = router