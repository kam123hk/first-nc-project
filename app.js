const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller');

app.get("/api/topics", getTopics);

app.use((error, req, res, next) => {
    console.log('error  here')
    res.status(400).send(error);
})

module.exports = app;