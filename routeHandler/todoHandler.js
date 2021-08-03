const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkLogin = require('../middleWares/checkLogin');
const todoSchema = require('../schemas/todoSchemas');
const Todo = new mongoose.model('Todo', todoSchema); // Todo(class) = name of the model class



// get all the todos
router.get('/', checkLogin, async (req, res) => {
    await Todo.find({ status: 'active' }).select({
        _id: 0,
        __v: 0,
        date: 0
    }).exec((err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error"
            });
        } else {
            res.status(200).json({
                result: data,
                message: "Success"
            });
        }
    });
});

// get active todos
router.get('/active', async (req, res) => {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
        data,
    });
});

// get active-callback todos(without async-await)
router.get('/active-callback', (req, res) => {
    const todo = new Todo();
    todo.findActiveCallback((err, data) => {
        res.status(200).json({
            data,
        });
    });
});

// get todo using static method
router.get('/js', async (req, res) => {
    const data = await Todo.findByJs();
    res.status(200).json({
        data,
    });
});

// get todo using query helpers
router.get('/language', async (req, res) => {
    const data = await Todo.find().byLanguage('react');
    res.status(200).json({
        data,
    });
});

// get a todo by id
router.get('/:id', async (req, res) => {
    try {
        const data = await Todo.find({ _id: req.params.id });
        res.status(200).json({
            result: data,
            message: "Success"
        });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side error"
        });
    }
});

// post todo
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo.save((err) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error"
            });
        } else {
            res.status(200).json({
                message: "Todo was inserted successfully"
            });
        }
    });
})

// post multiple todo
router.post('/all', async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error"
            });
        } else {
            res.status(200).json({
                message: "Todo was inserted successfully"
            });
        }
    });
})


//update todo
router.put('/:id', async (req, res) => {
    // return updated document bu using findByIdUpdate
    const result = await Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
            status: "active"
        },
        {
            new: true,
            useFindAndModify: false,
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    message: "There was a server side error"
                });
            } else {
                res.status(200).json({
                    message: "Todo was updated successfully"
                });
            }
        });
    console.log(result);
})

// delete todo
router.delete('/:id', async (req, res) => {
    await Todo.deleteOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "There was a server side error"
            });
        } else {
            res.status(200).json({
                message: "Todo was deleted successfully"
            });
        }
    });
})


module.exports = router;