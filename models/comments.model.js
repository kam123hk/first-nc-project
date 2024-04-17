const db = require('../db/connection');

async function deleteCommentByIdQuery(id) {
    try {
        await db.query(`
        DELETE FROM comments * WHERE comment_id=$1;`, [id]);        
    } catch (error) {
        throw error;
    }
}

async function checkCommentIdExists(id) {
    try {
        const comment = await db.query(`
        SELECT * FROM comments WHERE comment_id= $1;`, [id]);
        if (comment.rows.length === 0) {
            return Promise.reject({status: 404, message: 'comment not found'})
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {deleteCommentByIdQuery, checkCommentIdExists}