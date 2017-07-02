'use strict';

module.exports.define = models => {
    models.User.hasMany(models.Note, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        as: 'notes',
        onUpdate: 'RESTRICT',
        onDelete: 'CASCADE'
    });
};
