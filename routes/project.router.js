'use strict';

const express = require('express');
const ProjectController = require('../controllers').ProjectController;
const PublisherService = require('../service/publisher.service');

const router = express.Router();

router.get('/', async(req, res, next) => {
    const projects = await ProjectController.getAll();
    if (projects === undefined) {
        return res.status(404).end();
    }
    res.json(projects);
});

router.get('/:id', async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).end();
    }
    const project = await ProjectController.getById(req.params.id);
    if (project === undefined) {
        return res.status(404).end();
    }
    res.json(project);
});

router.post('/', async(req, res, next) => {
    if (!req.body.label || !req.body.gitUrl) {
        return res.status(400).end();
    }

    const project = await ProjectController.add(req.body.label, req.body.gitUrl);
    if (project === undefined) {
        return res.status(409).end();
    }
    res.status(201).json(project);
});


router.post('/test', async(req, res, next) => {
    const test = '{"projectname": "test", "projectpath":"/volume42", "datecreation":"24/06/2020"}'
    try {
        await PublisherService.publishToQueue(process.env.AMQP_WEBHOOK_QUEUE_NAME, test);
        res.data = {"message-sent":true};
        res.status(200).send({ status: true, response: res.data});
    } catch (ex) {
        res.status(500).end()
    }
})

module.exports = router;

