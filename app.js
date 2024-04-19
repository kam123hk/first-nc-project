const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller');
const {getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById} = require('./controllers/articles.controller');
const endpoints = require('./endpoints.json');
const {deleteCommentById} = require('./controllers/comments.controller')
const {getUsers, getUserByUsername} = require('./controllers/users.controller');

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
    res.status(200).send(endpoints)
})

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUserByUsername);


app.all("*", (req, res, next) => {
    res.status(404).send({message: "path not found"});
})


app.use((error, req, res, next) => {
    if (error.code === '22P02' || error.code === '23502') {
        res.status(400).send({message: 'bad request'});
    }
    // can add the ${user} from the constraints key if handling more 23503 errors from other sources of foreign key mishap
    if (error.code === '23503') {
        res.status(404).send({message: 'user not found'});
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
    next(error);
})

module.exports = app;