'use strict';

require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users.js');
const todo = require('./todo/model');
const Collection = require('./data-collection');

const DATABASE_URL = process.env.DATABASE_URL;

const DATABASE_CONFIG = {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    }
}

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const toDoModel = todo(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

const toDoCollection = new Collection(toDoModel);

module.exports = {
    db: sequelize,
    users: users,
    todo: toDoCollection,
}