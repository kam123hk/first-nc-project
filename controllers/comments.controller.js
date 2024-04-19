const {deleteCommentByIdQuery, checkCommentIdExists, updateCommentById} = require('../models/comments.model')

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

async function patchCommentById(req, res, next) {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    try {
        await checkCommentIdExists(comment_id);
        const comment = await updateCommentById(inc_votes, comment_id);
        res.status(201).send({comment});
    } catch (error) {
        next(error)
    }
}

module.exports = {deleteCommentById, patchCommentById}