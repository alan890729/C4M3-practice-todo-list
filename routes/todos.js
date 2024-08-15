const express = require('express')
const db = require('../models')

const router = express.Router()
const Todo = db.Todo

router.get('/', (req, res, next) => {
    return Todo.findAll({
        attributes: [
            'id',
            'name',
            'isCompleted'
        ],
        raw: true
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

    return Todo.create({ name }).then(() => {
        req.flash('success', '新增成功!')
        return res.redirect('/todos')
    }).catch((err) => {
        err.errorMessage = '新增失敗!!'
        next(err)
    })
})

router.get('/:id', (req, res, next) => {
    const todoId = req.params.id

    return Todo.findByPk(todoId, {
        attributes: [
            'id',
            'name',
            'isCompleted'
        ],
        raw: true
    }).then((todo) => {
        return res.render('todo', { todo })
    }).catch((err) => {
        err.errorMessage = '取得資料失敗!!'
        next(err)
    })

})

router.get('/:id/edit', (req, res, next) => {
    const todoId = req.params.id

    return Todo.findByPk(todoId, {
        attributes: [
            'id',
            'name',
            'isCompleted'
        ],
        raw: true
    }).then((todo) => {
        return res.render('edit', { todo })
    }).catch((err) => {
        err.errorMessage = '取得編輯頁失敗!!'
        next(err)
    })
})

router.put('/:id', (req, res, next) => {
    const todoId = req.params.id
    const { name, isCompleted } = req.body

    return Todo.update(
        { name, isCompleted: isCompleted === 'on' },
        {
            where: { id: Number(todoId) }
        }
    ).then(() => {
        req.flash('success', '編輯成功!')
        return res.redirect(`/todos/${todoId}`)
    }).catch((err) => {
        err.errorMessage = '編輯失敗!!'
        next(err)
    })
})

router.delete('/:id', (req, res, next) => {
    const todoId = req.params.id

    return Todo.destroy({
        where: {
            id: Number(todoId)
        }
    }).then(() => {
        req.flash('success', '刪除成功!')
        return res.redirect('/todos')
    }).catch((err) => {
        err.errorMessage = '刪除失敗!!'
        next(err)
    })
})

module.exports = router