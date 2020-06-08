'use strict';

class RouterBuilder {
    build(app) {
        app.use('/project', require('./project.router'));
    }
}

module.exports = new RouterBuilder();