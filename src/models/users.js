'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secret-string';

const userModel = (sequelize, DataTypes) => {
    const model = sequelize.define('Users', {
        username: { type: DataTypes.STRING, required: true, unique: true, allowNull: false },
        firstname: { type: DataTypes.STRING, required: true, allowNull: false },
        lastname: { type: DataTypes.STRING, required: true, allowNull: false },
        password: { type: DataTypes.STRING, required: true, allowNull: false },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
            unique: {
                args: true,
                msg: 'Email address already in use!'
            }
        },
        role: { type: DataTypes.ENUM('user', 'editor', 'admin'), required: true, defaultValue: 'user', allowNull: false },
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
                    editor: ['read', 'create', 'update'],
                    admin: ['read', 'create', 'update', 'delete']
                };
                return acl[this.role];
            }
        }
    });

    model.beforeCreate(async (user) => {
        let hashedPass = await bcrypt.hash(user.password, 10);
        user.password = hashedPass;
    });

    model.beforeUpdate(async (user) => {
        let hashedPass = await bcrypt.hash(user.password, 10);
        user.password = hashedPass;
      });

    model.authenticateBasic = async function (username, password) {
        const user = await this.findOne({ where: { username } });
        const valid = await bcrypt.compare(password, user.password);
        if (valid) { return user; }
        throw new Error('Invalid User');
    };

    model.authenticateToken = async function (token) {
        try {
            const parsedToken = jwt.verify(token, SECRET);
            const user = await this.findOne({ where: { username: parsedToken.username } });
            if (user) { return user; }
            throw new Error("User Not Found");
        } catch (e) {
            throw new Error(e.message)
        }
    };

    return model;
}

module.exports = userModel;