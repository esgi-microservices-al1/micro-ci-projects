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

router.get('/branches/:id', async (req, res, next) => {
    const project = await ProjectController.addProjectBranches(req.params.id);
    if (project === undefined) {
        return res.status(404).end();
    }
    res.json(project);
});

router.post('/', async(req, res, next) => {
    if (!req.body.label || !req.body.gitUrl || !req.body.gitHost) {
        return res.status(400).end();
    }

    const project = await ProjectController.add(req.body.label, req.body.gitUrl, req.body.accessToken, req.body.gitHost);
    if (project === undefined) {
        return res.status(409).end();
    }
    res.status(201).json(project);
});


router.post('/test', async(req, res, next) => {
    try {
        try {
            await PublisherService.publishToQueue(process.env.AMQP_WEBHOOK_QUEUE_NAME, JSON.stringify(req.body));
            res.data = {"message-sent":true};
            res.status(200).send({ status: true, response: res.data});
        } catch (ex) {
            res.status(500).end()
        }
    } catch (error) {
        return res.status(404);
    }
})

router.post('/test2', async(req, res, next) => {
    try {
        console.log(`\nReceived as body: ${JSON.stringify(req.body)}\n`);
        await PublisherService.publishToQueue(process.env.AMQP_SCHEDULER_QUEUE_NAME, JSON.stringify(req.body));
        res.data = {"message-sent":true};
        res.status(200).send({ status: true, response: res.data});
    } catch (ex) {
        res.status(500).end()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).end();
        }
        const isDeleted = await ProjectController.deleteProject(req.params.id);
        if (!isDeleted) {
            return res.status(404).end();
        }
        res.status(200).send("Project deleted!");
    } catch (e) {
        res.status(500);
    }
})

module.exports = router;

