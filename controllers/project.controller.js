'use strict';

const publisherService = require('../service/publisher.service');

const Project = require('../models').Project;

const { exec } = require('child_process');
const util = require('util');
const asyncExec = util.promisify(require('child_process').exec);

class ProjectController {

    async add(label, gitUrl, accessToken, gitHost) {
        if (await Project.findOne({label: label})) {
            return undefined;
        }

        if (await Project.findOne({git_url: gitUrl})) {
            return undefined;
        }

        const project = new Project({
            label: label,
            git_url: gitUrl,
            access_token: accessToken,
            git_host: gitHost,
            branches: [],
            storage_url: '',
            enable: false
        });

        try {
            const savedProject = await project.save();
            await this.projectsFolderExists();
            await this.cloneProject(savedProject);
            return savedProject;
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
            const project = await Project.findById(id);
            return project;
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

    async addProjectBranches(projectId) {
        const project = await Project.findById(projectId);
        try {
            const branches = await this.getBranches(project);
            project.branches = branches;
        } catch (error) {
            return error;
        }
        return project.save();
    }

    async webHookProcess(url) {
        if (!url) {
            console.error("No url was given!");
            return;
        }
        const project = await this.getByRepository(url);
        if (project == undefined) {
            return;
        }
        await this.pullProject(project);
        publisherService.publishToQueue(process.env.AMQP_PUBLISH_QUEUE_NAME, project)
        return;
    }

    commandsError(error, stderr) {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    }

    async projectsFolderExists() {
        const { stdout, stderr, error } = await asyncExec('ls -a /');
        this.commandsError(error, stderr);
        if (stdout.indexOf('projects-repository') === -1) {
            exec('cd / && mkdir -p projects-repository', (error, stderr, stdout) => {
                this.commandsError(error, stderr);
                console.log(stdout);
                return;
            })
        }
        return;
    }

    async checkProjectRepositoryExists(project) {
        const { stdout, stderr, error } = await asyncExec('cd /projects-repository && ls');
        this.commandsError(error, stderr);
        if (stdout.indexOf(project._id) !== -1) {
            console.error(`Project with url: ${project.git_url}, already exists`);
            return true;
        }
        return false;
    }

    async cloneProject(project) {
        if (await this.checkProjectRepositoryExists(project)) {
            console.error(`Project with url: ${project.git_url}, already exists`);
            return;
        }
        let cloneUrl = new String(project.git_url);
        if (project.access_token) {
            if (project.gitHost === 'github') {
                cloneUrl = cloneUrl.replace("https://", `https://${project.access_token}@`);
            } else {
                cloneUrl = cloneUrl.replace("https://", `https://oauth2:${project.access_token}@`);
            }
        }
        const { stdout, stderr, error } = await asyncExec(`cd /projects-repository && git clone ${cloneUrl} ${project._id}`);
        this.commandsError(error, stderr);
        console.log(`stdout: ${stdout}`);
    }

    async pullProject(project) {
        const { stdout, stderr, error } = await asyncExec(`cd /projects-repository/${project[0]._id} && git pull origin master`);
        this.commandsError(error, stderr);
        console.log(`stdout: ${stdout}`);
        return;
    }

    async scheduler(data) {
        const project = this.getByLabel(data.projectName);
    }

    async getBranches(project) {
        const { stdout, stderr, error } = await asyncExec(`cd /projects-repository/${project._id} && git branch -a`);
        this.commandsError(error, stderr);
        let branches = stdout.split('\n');
        //Remove spaces added by git branch command
        branches = branches.map(el => el.trim());
        //Remove the first line returned by git branch wich is the current branch
        branches.shift();
        //Remove the second line returned by git branch wich is the current branch too
        branches.shift();
        //Remove empty string at the end returned by git branch
        branches.pop();
        return branches;
    }
}

module.exports = new ProjectController();