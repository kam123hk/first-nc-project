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
    const comment = await db.query(`
    SELECT * FROM comments WHERE comment_id= $1;`, [id]);
    if (comment.rows.length === 0) {
        return Promise.reject({status: 404, message: 'comment not found'})
    }
}

async function updateCommentById(votes, id) {
    const comment = await db.query(`
    UPDATE comments SET votes=votes+$1
    WHERE comment_id=$2 RETURNING *;`, [votes, id]);
    return comment.rows[0];
}


module.exports = {deleteCommentByIdQuery, checkCommentIdExists, updateCommentById}