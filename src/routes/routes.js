'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('../models');
const signupCheck = require("../middleware/signupCheck");
const basicAuth = require('../middleware/basic.js')
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')

authRouter.post('/signup', signupCheck, async (req, res, next) => {
    const userInfo = {
        id: req.user.id,
        username: req.user.username,
        password: req.user.password
    };
    res.status(201).json(userInfo);
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
    const user = {
        username: req.user.username,
        password: req.user.password,
        role: req.user.role,
        capabilities: req.user.capabilities,
        token: req.user.token
    };
    res.status(200).json(user);
});

authRouter.put('/updateAccount', bearerAuth, async (req, res, next) => {
    const id = req.userId
    let userRecord = await users.findOne({ where: { id: id } })
  
    const output = req.body
    output.token = userRecord.token
    const updateRecored = await userRecord.update(output);
    res.send(updateRecored);
  
  });
  
  authRouter.delete('/deleteAccount', bearerAuth, async (req, res, next) => {
    const id = req.userId
  
    await users.destroy({ where: { id: id } })
    
    res.send('Account Deleted');
  
  });

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
    try {
        const userRecords = await users.findAll({});
        const list = userRecords.map(user => `◼ ${user.username} 〰 ${user.role}`);
        res.status(200).json(list);
    } catch (e) {
        next(e.message)
    }
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
    const secretInfo = {
        secret: 'Welcome to the secret area 🔐',
        user: req.user,
        token: `📌 ${req.token}`
    };
    res.status(200).json(secretInfo)
});

module.exports = authRouter;