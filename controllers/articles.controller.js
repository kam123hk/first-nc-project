const {selectArticleById, selectArticles} = require('../models/articles.model');


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
    const {sort_by} = req.query
    try {
        const articles = await selectArticles(sort_by);
        res.status(200).send({articles})
    } catch(error) {
        next(error)
    }
}

module.exports = {getArticleById, getArticles}