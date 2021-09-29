'use strict';

const todoModel = (sequelize, DataTypes) => sequelize.define('todo', {
  toDoItem: { type: DataTypes.STRING, required: true },
  assignedTo: { type: DataTypes.STRING, required: true },
  difficulty: { type: DataTypes.INTEGER, required: true },
  complete: { type: DataTypes.BOOLEAN, required: true },
});

module.exports = todoModel;