const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller');
const endpoints = require('./endpoints.json');

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
    res.status(200).send(endpoints)
})

app.all("*", (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

module.exports = app;