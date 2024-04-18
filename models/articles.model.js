const db = require("../db/connection");


async function selectArticleById(id) {
    try {
        const article = await db.query(`
        SELECT author, title, article_id, body, topic, articles.created_at, votes, article_img_url FROM articles WHERE article_id=$1;`, [id]);
        if (article.rows.length === 0) {
            return Promise.reject({status:404, message:'article not found'})
        }
        // some logic to alter the date can go here?
        return article.rows[0];
    } catch(error) {
        throw error;
    }
}

async function selectArticles(sort_by='created_at', topic) {
    const validSortBys = ["created_at"];
    const values = [];
    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({status: 400, message: "bad request"})}
    let sqlQueryString = '';
    sqlQueryString += `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url, COUNT(comments.article_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`

    if (topic) {
        sqlQueryString += ` WHERE articles.topic=$1`;
        values.push(topic)
    }
    sqlQueryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} DESC;`

    const articles = await db.query(sqlQueryString, values);
    return articles.rows;
}

async function selectCommentsByArticleId(id) {
    try {
        const comments = await db.query(`
        SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;`, [id]);
        return comments.rows;
    } catch (error) {
        throw error
    }
}

async function checkArticleIdExists(id) {
    try {
        const article = await db.query(`
        SELECT * FROM articles WHERE article_id=$1;`, [id]);
        if (article.rows.length === 0) {
            return Promise.reject({status: 404, message: 'article not found'})
        }
    } catch (error) {
        throw error
    }
}

async function insertCommentByArticleId(username, body, id) {
    try {
        if (username === undefined || body === undefined) {
            return Promise.reject({status: 400, message: 'bad request'});
        }
        const comment = await db.query(`
        INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;
        `, [body, username, id]);
        return comment.rows[0];
    } catch (error) {
        throw error
    }
}

async function updateArticleById(votes, id) {
    try {
        if (votes === undefined) {
            return Promise.reject({status: 400, message: 'bad request'})
        }
        const article = await db.query(
        `UPDATE articles SET votes=votes+$1
        WHERE article_id=$2
        RETURNING*;`, [votes, id]);
        return article.rows[0];
    } catch (error) {
        throw error;
    }
}


module.exports = {selectArticleById, selectArticles, selectCommentsByArticleId, checkArticleIdExists, insertCommentByArticleId, updateArticleById};