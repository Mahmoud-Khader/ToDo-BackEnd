'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET ||'mySecret';

const userModel = (sequelize, DataTypes) => {
    const model = sequelize.define('Users-lab9', {
      username: { type: DataTypes.STRING, required: true, unique: true },
      firstname: { type: DataTypes.STRING, required: true },
      lastname: { type: DataTypes.STRING, required: true },
      email: { type: DataTypes.STRING, required: true ,unique: true},
      password: { type: DataTypes.STRING, required: true },
      role: { type: DataTypes.ENUM('user', 'editor', 'admin'), required: true, defaultValue: 'user'},
      token: {
        type: DataTypes.VIRTUAL,
        get() {
            return jwt.sign({ username: this.username, capabilities: this.capabilities }, SECRET);
        },
        set(tokenObj) {
            let token = jwt.sign(tokenObj, SECRET);
            return token;
        }
    },
      capabilities: {
        type: DataTypes.VIRTUAL,
        get() {
          const acl = {
            user: ['read'],
            writer: ['read', 'create'],
            editor: ['read', 'create', 'update'],
            admin: ['read', 'create', 'update', 'delete']
          };
          return acl[this.role];
        },
        set() {
            return 
         }
      }
    });
  
    model.beforeCreate(async (user) => {
      let hashedPass = await bcrypt.hash(user.password, 10);
      user.password = hashedPass;
      return hashedPass
    });
  
    model.authenticateBasic = async function (username, password) {
      const user = await this.findOne({ where: {username: username}} );
      const valid = await bcrypt.compare(password, user.password);
      if (valid) { return user; }
      throw new Error('Invalid User');
    };
  
    model.authenticateToken = async function (token) {
      try {
        const parsedToken = jwt.verify(token, SECRET);
        const user = this.findOne({where: { username: parsedToken.username } });
        if (user) { return user; }
        throw new Error("User Not Found");
      } catch (e) {
        throw new Error(e.message)
      }
    };
  
    return model;
  }
  
  module.exports = userModel;