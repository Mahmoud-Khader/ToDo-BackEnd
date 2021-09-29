'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const todoModel = require('./todo/model');
const userModel = require('./users');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL;
 

let sequelizeOptions = {
  dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
};


const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);
const todo = todoModel(sequelize, DataTypes);


module.exports = {
  db: sequelize,
  todo: new Collection(todo),
  users: userModel(sequelize, DataTypes),
};