const db = require("../db/connection");


async function selectArticleById(id) {
    try {
        const article = await db.query(`
        SELECT * FROM articles WHERE article_id=$1;`, [id]);
        // some logic to alter the date can go here?
        return article.rows[0];
    } catch(error) {
        next(error)
    }
}

module.exports = {selectArticleById};