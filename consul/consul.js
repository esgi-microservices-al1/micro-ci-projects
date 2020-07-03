'use strict';

const port = Number(process.env.CONSUL_PORT);

const consul = require('consul')({
    host: process.env.CONSUL_HOST,
    port: Number(process.env.CONSUL_PORT)
});


console.log(process.env.CONSUL_HOST + ':' + process.env.CONSUL_PORT);

const uuid = require('uuid');

const details = {
    name: process.env.APPLICATION_NAME,
    address: process.env.HOST || 'localhost',
    port: Number(process.env.PORT),
    id: `${process.env.APPLICATION_NAME}-${uuid.v4()}`,
    check: {
        ttl: '10s',
        deregister_critical_service_after: '1m'
    },
    tags : [
        'Test Consul For Project Micro Service',
    ],
    token: process.env.CONSUL_TOKEN
};


const register = () => {
    console.log('REGISTER');
    consul.agent.service.register(details, err => {
        console.log(details);
        if (err) { 
            console.log(err.message, err.stack); 
            console.log("ERRRRREUUUUUUR")
        }
        else { console.log('consul good zkqhdkqz'); }
    });
};

const healthCheck = (serviceId) => {
    console.log('HEALTHCHECK');
    const jsonId = { id: `service:${serviceId}`, token: process.env.CONSUL_TOKEN };

    setInterval(() => {
        consul.agent.check.pass(jsonId, (err) => {
            if (err) { console.log(err.message); }
        })
    }, 5000);
};

const unregister = (consul_id) => {
    console.log(consul_id);
    const unregisterService = () => {
        consul.agent.service.deregister(consul_id, () => {
            process.exit(err ? 1 : 0);
        });
    };
    unregisterService();
    process.on('exit', unregisterService);
    process.on('SIGINT', unregisterService);
    process.on('uncaughtException', unregisterService);
}

module.exports.register = register;
module.exports.healthcheck = healthCheck;
module.exports.unregister = unregister;