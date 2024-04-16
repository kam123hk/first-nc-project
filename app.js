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


app.use((error, req, res, next) => {
    if (error.code === '22P02') {
        res.status(400).send({message: 'bad request'});
    }
    next(error);
})

app.use((error, req, res, next) => {
     if (error.status && error.message) {
        res.status(error.status).send({message: error.message});
     }
     next(error);
})

app.use((error, req, res, next) => {
    res.status(500).send({message: 'Internal Server Error'});
})

module.exports = app;