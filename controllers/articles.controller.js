const {selectArticleById, selectArticles, selectCommentsByArticleId, checkArticleIdExists, insertCommentByArticleId, updateArticleById, insertArticle} = require('../models/articles.model');
const {checkTopicExists} = require('../models/topics.model');

async function getArticleById(req, res, next) {
    const {article_id} = req.params;
    try {
        const article = await selectArticleById(article_id);
        res.status(200).send({article})
    } catch(error) {
        next(error);
    }
}

async function getArticles(req, res, next) {
    const {sort_by, topic, order} = req.query
    try {
        if (topic) await checkTopicExists(topic);
        const articles = await selectArticles(sort_by, topic, order);
        res.status(200).send({articles})
    } catch(error) {
        next(error)
    }
}

async function getCommentsByArticleId(req, res, next) {
    const {article_id} = req.params;
    try {
        await checkArticleIdExists(article_id);
        const comments = await selectCommentsByArticleId(article_id);
        res.status(200).send({comments});
    } catch (error) {
        next(error);
    }
}

async function postCommentByArticleId(req, res, next) {
    
    const {username, body} = req.body;    
    const {article_id} = req.params;

    try {
        await checkArticleIdExists(article_id);
        const comment = await insertCommentByArticleId(username, body, article_id);
        res.status(201).send({comment});
    } catch (error) {
        next(error)
    }
}

async function patchArticleById(req, res, next) {
    const {inc_votes} = req.body;
    const {article_id} = req.params;
    try {
        await checkArticleIdExists(article_id);
        const article = await updateArticleById(inc_votes, article_id)
        res.status(200).send({article})
    } catch (error) {
        next(error);
    }
}

async function postArticle(req, res, next) {
    const {title, topic, author, body, created_at, article_img_url} = req.body;
    try {
        const article_id = await insertArticle(title, topic, author, body, created_at, article_img_url);
        const article = await selectArticleById(article_id)
        res.status(201).send({article});
    } catch (error) {
        next(error);
    }
}


module.exports = {getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById, postArticle}