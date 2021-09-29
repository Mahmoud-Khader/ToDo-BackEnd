'use strict';

const { users } = require('../models');

module.exports = async (req, res, next) => {

    let userRecord = await users.findOne({ where: { username: req.body.username } });

    if (userRecord) { next('Username alerady exists 👎') }

    try {
        req.user = await users.create(req.body);
        next();
    } catch (e) {
        next(e.message)
    }

};