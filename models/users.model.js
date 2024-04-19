const db = require('../db/connection');

async function selectUsers() {
    const users = await db.query(`
    SELECT * FROM users;`)
    return users.rows;
}

async function selectUserByUsername(username) {
    const user = await db.query(`
    SELECT * FROM users WHERE username=$1;`, [username]);
    if (user.rows.length === 0) {
        return Promise.reject({status: 404, message: 'username not found'})
    }
    return user.rows[0];
}

module.exports = {selectUsers, selectUserByUsername};