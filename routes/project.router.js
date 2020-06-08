'use strict';

const express = require('express');
const ProjectController = require('../controllers').ProjectController;

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

router.post("/", async(req, res, next) => {
    if (!req.body.label || !req.body.gitUrl) {
        return res.status(400).end();
    }

    const project = await ProjectController.add(req.body.label, req.body.gitUrl);
    if (project === undefined) {
        return res.status(409).end();
    }
    res.status(201).json(project);
});

module.exports = router;

