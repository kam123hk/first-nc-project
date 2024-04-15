const { selectTopics } = require("../models/topics.model")


async function getTopics(req, res, next) {
    try {
    const topics = await selectTopics();
    console.log(topics, '<-topics in controller')
    res.status(200).send({topics})
    } catch(error) {
        next(error)
    }
}

module.exports = {getTopics}