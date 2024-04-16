const db = require("../db/connection");


async function selectArticleById(id) {
    try {
        const article = await db.query(`
        SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at,
        CASE WHEN SUM(comments.votes) IS NULL THEN 0 
        ELSE SUM(comments.votes)::INTEGER END AS votes,
        articles.article_img_url FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1
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

async function selectArticles() {
    try {
        const articles = await db.query(`
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, SUM(comments.votes)::INTEGER AS votes, articles.article_img_url, COUNT(comments.article_id)::INTEGER AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;
        `);
        return articles.rows;
    } catch(error) {
        throw error;
    }
}


module.exports = {selectArticleById, selectArticles};