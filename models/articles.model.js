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

async function selectArticles(sort_by='created_at') {
    const validSortBys = ["created_at"];
    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({status: 400, message: "bad request"})}
    let sqlQueryString = '';
    sqlQueryString += `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, CASE WHEN SUM(comments.votes) IS NULL THEN 0 
    ELSE SUM(comments.votes)::INTEGER END AS votes, articles.article_img_url, COUNT(comments.article_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`
    sqlQueryString += ` ORDER BY ${sort_by} DESC;`
    try {
        const articles = await db.query(sqlQueryString);
        return articles.rows;
    } catch(error) {
        throw error;
    }
}

async function selectCommentsByArticleId(id) {
    try {
        const comments = await db.query(`
        SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;`, [id]);
        return comments.rows;
    } catch (error) {
        // throw error
    }
}

async function checkArticleIdExists(id) {
    try {
        const article = await db.query(`
        SELECT * FROM articles WHERE article_id=$1`, [id]);
        if (article.rows.length === 0) {
            return Promise.reject({status: 404, message: 'article not found'})
        }
    } catch (error) {
        throw error
    }
}


module.exports = {selectArticleById, selectArticles, selectCommentsByArticleId, checkArticleIdExists};