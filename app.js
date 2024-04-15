const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller');
const {getArticleById} = require('./controllers/articles.controller');
const endpoints = require('./endpoints.json');

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
    res.status(200).send(endpoints)
})

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

module.exports = app;