const db = require('../db/connection');

async function selectTopics() {
    try {
    const topics = await db.query(`SELECT * FROM topics;`);
    return topics.rows;
    } catch(error) {
        next(error)
    }
}

async function checkTopicExists(topic) {
    const topics = await db.query(`
    SELECT * FROM topics WHERE slug=$1;`, [topic]);
    if (topics.rows.length === 0) {
        return Promise.reject({status: 404, message: 'topic not found'})
    }
}

module.exports = {selectTopics, checkTopicExists}