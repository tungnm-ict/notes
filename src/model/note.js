'use strict';

const Sequelize = require('sequelize');

module.exports.define = sequelize => {
    return sequelize.define('Note', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        subject: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        body: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    }, {
        indexes: [
            {
                name: 'Notes_user_id',
                unique: true,
                fields: ['userId', 'id']
            },
        ],
    });
};
