'use strict';

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

        try {
            return await project.save;
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

}

module.exports = new ProjectController();