const db = require('../db/connection');

async function selectTopics() {
    try {
    const topics = await db.query(`SELECT * FROM topics`);
    return topics.rows;
    } catch(error) {
        next(error)
    }
}

module.exports = {selectTopics}