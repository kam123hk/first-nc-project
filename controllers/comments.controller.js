const {deleteCommentByIdQuery, checkCommentIdExists} = require('../models/comments.model')

async function deleteCommentById(req, res, next) {
    const {comment_id} = req.params;
    try {
        await checkCommentIdExists(comment_id);
        await deleteCommentByIdQuery(comment_id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {deleteCommentById}