const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller');

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

module.exports = app;