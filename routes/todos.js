const express = require('express')
const db = require('../models')

const router = express.Router()
const Todo = db.Todo

router.get('/', (req, res) => {
    try {
        return Todo.findAll({
            attributes: [
                'id',
                'name',
                'isCompleted'
            ],
            raw: true
        }).then((todos) => {
            res.render('todos', {
                todos,
                message: req.flash('success'),
                error: req.flash('error')
            })
        }).catch((err) => {
            console.error(err)
            req.flash('error', '取得資料失敗!!')
            res.redirect('/todos')
        })
    } catch (err) {
        console.error(err)
        req.flash('error', '伺服器錯誤')
        res.redirect('/todos')
    }

})

router.get('/new', (req, res) => {
    try {
        res.render('new', { error: req.flash('error') })
    } catch (err) {
        console.error(err)
        req.flash('error', '伺服器錯誤，取得新增頁失敗!!')
        res.redirect('back')
    }
})

router.post('/', (req, res) => {

    try {
        const { name } = req.body

        return Todo.create({ name }).then(() => {
            req.flash('success', '新增成功!')
            res.redirect('/todos')
        }).catch((err) => {
            console.error(err)
            req.flash('error', '新增失敗!!')
            res.redirect('back')
        })
    } catch (err) {
        console.error(err)
        req.flash('error', '新增失敗!!')
        return res.redirect('back')
    }

})

router.get('/:id', (req, res) => {
    try {
        const todoId = req.params.id

        return Todo.findByPk(todoId, {
            attributes: [
                'id',
                'name',
                'isCompleted'
            ],
            raw: true
        }).then((todo) => {
            res.render('todo', {
                todo,
                message: req.flash('success'),
                error: req.flash('error')
            })
        }).catch((err) => {
            console.error(err)
            req.flash('error', '取得資料失敗!!')
            res.redirect('back')
        })
    } catch (err) {
        console.error(err)
        req.flash('error', '取得資料失敗!!')
        res.redirect('back')
    }

})

router.get('/:id/edit', (req, res) => {
    try {
        const todoId = req.params.id

        return Todo.findByPk(todoId, {
            attributes: [
                'id',
                'name',
                'isCompleted'
            ],
            raw: true
        }).then((todo) => {
            res.render('edit', { todo, error: req.flash('error') })
        }).catch((err) => {
            console.error(err)
            req.flash('error', '取得編輯頁失敗!!')
            res.redirect(`/todos/${todoId}`)
        })
    } catch (err) {
        const todoId = req.params.id
        console.error(err)
        req.flash('error', '取得編輯頁失敗!!')
        res.redirect(`/todos/${todoId}`)
    }

})

router.put('/:id', (req, res) => {
    try {
        const todoId = req.params.id
        const { name, isCompleted } = req.body

        return Todo.update(
            { name, isCompleted: isCompleted === 'on' },
            {
                where: { id: Number(todoId) }
            }
        ).then(() => {
            req.flash('success', '編輯成功!')
            res.redirect(`/todos/${todoId}`)
        }).catch((err) => {
            console.error(err)
            req.flash('error', '編輯失敗!!')
            res.redirect('back')
        })
    } catch (err) {
        console.error(err)
        req.flash('error', '編輯失敗!!')
        res.redirect('back')
    }

})

router.delete('/:id', (req, res) => {

    try {
        const todoId = req.params.id

        return Todo.destroy({
            where: {
                id: Number(todoId)
            }
        }).then(() => {
            req.flash('success', '刪除成功!')
            res.redirect('/todos')
        }).catch((err) => {
            console.error(err)
            req.flash('error', '刪除失敗!')
            res.redirect(`/todos`)
        })
    } catch (err) {
        console.error(err)
        req.flash('error', '刪除失敗!')
        res.redirect(`/todos`)
    }
})

module.exports = router