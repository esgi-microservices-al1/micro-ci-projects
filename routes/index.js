'use strict';

class RouterBuilder {
    build(app) {
        app.user('/project', require('./project.router'));
    }
}

module.exports = new RouterBuilder();