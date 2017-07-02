'use strict';

const bcrypt = require('bcrypt');
const q = require('q');
const Sequelize = require('sequelize');

module.exports.define = sequelize => {
    return sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    }, {
        indexes: [
            {
                name: 'Users_name',
                unique: true,
                fields: ['name']
            },
        ],
        instanceMethods: {
            verifyPassword(password) {
                return q.ninvoke(bcrypt, 'compare', password, this.password);
            },

            setPassword(password) {
                return q.ninvoke(bcrypt, 'genSalt').then(salt => {
                    return q.ninvoke(bcrypt, 'hash', password, salt).then(hash => {
                        this.password = hash;
                    });
                });
            },
        },
        classMethods: {
            createUser(name, password) {
                const builtUser = this.build({
                    name
                });
                return builtUser.setPassword(password).then(() => {
                    return builtUser.save();
                });
            }
        }
    });
};
