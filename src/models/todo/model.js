'use strict';

const todoModel = (sequelize, DataTypes) => sequelize.define('todo', {
  toDoItem: { type: DataTypes.STRING, required: true },
  assignedTo: { type: DataTypes.STRING, required: true },
  difficulty: { type: DataTypes.INTEGER, required: true, default: 3 },
  complete: { type: DataTypes.BOOLEAN, required: true, default: false },
});

module.exports = todoModel;