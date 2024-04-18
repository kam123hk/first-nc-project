const db = require('../db/connection');

async function selectUsers() {
    try {
        const users = await db.query(`
        SELECT * FROM users;`)
        return users.rows;
    } catch (error) {
        
    }
}

module.exports = {selectUsers};