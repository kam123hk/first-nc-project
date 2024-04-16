const db = require("../db/connection");


async function selectArticleById(id) {
    try {
        const article = await db.query(`
        SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, SUM(comments.votes)::INTEGER AS votes, articles.article_img_url FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1
        GROUP BY articles.article_id;`, [id]);
        if (article.rows.length === 0) {
            return Promise.reject({status:404, message:'article not found'})
        }
        // some logic to alter the date can go here?
        return article.rows[0];
    } catch(error) {
        throw error;
    }
}

module.exports = {selectArticleById};