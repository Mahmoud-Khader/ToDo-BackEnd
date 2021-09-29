'use strict';

const todoModel = (sequelize, DataTypes) => sequelize.define('todo', {
  text: { type:DataTypes.STRING, required:true },
  assignee: { type:DataTypes.STRING, required:true },
  difficulty: {type:DataTypes.INTEGER, required:true, default: 3},
  complete: {type:DataTypes.BOOLEAN, required:true, default:false},
});

module.exports = todoModel;