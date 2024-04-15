const {selectArticleById} = require('../models/articles.model');


async function getArticleById(req, res, next) {
    const {article_id} = req.params;
    try {
        const article = await selectArticleById(article_id);
        res.status(200).send({article})
    } catch(error) {
        next(error)
    }
}

module.exports = {getArticleById}