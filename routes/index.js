'use strict';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

class RouterBuilder {
    build(app) {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        app.use('/project', require('./project.router'));
    }
}

module.exports = new RouterBuilder();