'use strict';

const _ = require('lodash');
const q = require('q');
const model = require('../src/model');

return model.sequelize.sync().then(() => {
    const users = _.times(3, i => ({
        name: `user${ i + 1 }`,
        password: `password${ i + 1 }`,
    }));

    return q.all(_.map(users, user => {
        return model.User.createUser(user.name, user.password);
    }));
}).catch(e => {
    console.log(e);
    process.exit(1);
}).done(() => {
    process.exit(0);
});
