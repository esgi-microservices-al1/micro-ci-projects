'use strict';

const publisherService = require('../service/publisher.service');

const Project = require('../models').Project;

class ProjectController {

    async add(label, gitUrl) {
        if (await Project.findOne({label: label})) {
            return undefined;
        }

        if (await Project.findOne({git_url: gitUrl})) {
            return undefined;
        }

        const project = new Project();
        project.label = label;
        project.git_url = gitUrl;
        project.enable = false;

        try {
            return await project.save();
        } catch(err) {
            return undefined;
        }
    }

    async getAll() {
        try {
            const projects = await Project.find();
            if (projects.length > 0 && projects !== undefined) {
                return projects;
            }
            return undefined;
        } catch(err) {
            return undefined;
        }
    
    }

    async getById(id) {
        try {
            return await Project.findById(id);
        } catch(err) {
            return undefined;
        }
    }

    async getByRepository(repository) {
        try {
            return await Project.find({ git_url: repository});
        } catch (err) {
            return undefined;
        }
    }
    
    async getByLabel(label) {
        try {
            return await Project.find( {label: label} );
        } catch (err) {
            return undefined;
        }
    }

    async webHookProcess(data) {
        if (!data || !data.repository_name) {
            return
        }
        const project = this.getByRepository(data.repository_name);
        if (project == undefined) {
            return
        }
        //TODO pull project in volume
        publisherService.publishToQueue(process.env.AMQP_PUBLISH_QUEUE_NAME, project)
    }

    async scheduler(data) {
        const project = this.getByLabel(data.projectName);
        
    } 
}

module.exports = new ProjectController();