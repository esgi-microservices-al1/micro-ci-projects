'use strict';

const port = Number(process.env.CONSUL_PORT);
const RegistrationDetails = require('./registration.details');

const consul = require('consul')({
    host: process.env.CONSUL_HOST,
    port: Number(process.env.CONSUL_PORT),
});

console.log(process.env.CONSUL_HOST + ':' + process.env.CONSUL_PORT);

const tags = [
    'traefik.enable=true',
    'traefik.frontend.entryPoints=http',
    `traefik.frontend.rule=PathPrefixStrip:/${process.env.APPLICATION_NAME}-ci/`
];

const details = new RegistrationDetails(process.env.APPLICATION_NAME, 
    process.env.HOST || 'localhost', process.env.PORT, 
    tags, process.env.CONSUL_TOKEN);

const register = () => {
    console.log('Consul register START');
    consul.agent.service.register(details, err => {
        console.log(details);
        if (err) { 
            console.log(err.message, err.stack); 
            console.log("Consul ERROR")
        }
        else { console.log('Consul Successfully Register'); }
    });

    const jsonId = { id: `service:${details.id}`, token: process.env.CONSUL_TOKEN || null };

    setInterval(() => {
        consul.agent.check.pass(jsonId, (err) => {
            if (err) { 
                console.log("\n\nconsul error in interval\n\n");
                console.log(err.message); 
            }
        })
    }, 5000);
    
    process.on('exit', unregister);
    process.on('SIGINT', unregister);
    process.on('uncaughtException', unregister);
    
};

function unregister() {

    console.log('Unregister Consul')
    const toUnregister = {
        id: details.id,
        token: process.env.CONSUL_TOKEN || null };
    consul.agent.service.deregister(toUnregister, (err) => {
        process.exit(err ? 1 : 0);
    });
}

module.exports.register = register;