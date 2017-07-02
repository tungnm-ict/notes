'use strict';

function errorHandler(e, req, res, next) {
    res.status(404).render('error');
}

module.exports = {
    errorHandler
};
