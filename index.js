const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routeHandler/todoHandler')
const userHandler = require('./routeHandler/userHandler')

// express app initialization
const app = express();
dotenv.config()
app.use(express.json());

// database connection in mongodb
mongoose
    .connect('mongodb://localhost/todos', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log('database connection established'))
    .catch(err => console.log(err))

// application routes
app.use('/todo', todoHandler);
app.use('/user', userHandler);


// default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
}
app.use(errorHandler);

app.listen(3000, () => {
    console.log('listening on port 3000');
})