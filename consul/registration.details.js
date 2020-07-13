'use strict';
const uuid = require('uuid');

class RegistrationDetails {
    constructor(name, address, port, tags, token) {
        this.name = name;
        this.address = address;
        this.port = Number(port);
        this.id = `${name}-${uuid.v4()}`;
        this.tags = tags;
        this.check = {
            ttl: '10s',
            deregister_critical_service_after: '1m'
        };
        this.token = token;
    }
}

module.exports = RegistrationDetails;