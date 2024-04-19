const { userData } = require('../db/data/test-data');
const {selectUsers, selectUserByUsername} = require('../models/users.model');

async function getUsers(req, res, next) {
    try {
        const users = await selectUsers();
        res.status(200).send({users});
    } catch (error) {
        next(error);
    }
}

async function getUserByUsername(req, res, next) {
    const {username} = req.params;
    try {
        const user = await selectUserByUsername(username);
        res.status(200).send({user})
    } catch (error) {
        next(error);
    }
}

module.exports = {getUsers, getUserByUsername};