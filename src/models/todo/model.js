'use strict';

const todoModel = (sequelize, DataTypes) => sequelize.define('todo', {
  toDoItem: { type: DataTypes.STRING, required: true },
  assignedTo: { type: DataTypes.STRING, required: true },
  difficulty: { type: DataTypes.INTEGER, required: true,defaultValue:3 },
  complete: { type: DataTypes.BOOLEAN, required: true,defaultValue:false },
});

module.exports = todoModel;