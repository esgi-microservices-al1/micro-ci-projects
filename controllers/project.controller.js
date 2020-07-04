'use strict';

const publisherService = require('../service/publisher.service');

const Project = require('../models').Project;

const { exec } = require('child_process');

class ProjectController {

    async add(label, gitUrl, accessToken, gitHost) {
        if (await Project.findOne({label: label})) {
            return undefined;
        }

        if (await Project.findOne({git_url: gitUrl})) {
            return undefined;
        }
        console.log(accessToken);

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

    async cloneProject(project) {
        console.log(`\n${project}\n`);
        exec(`cd ../projects && ls`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            if (stdout.indexOf(project._id) !== -1) {
                console.error(`Project with url: ${project.git_url}, already exists`);
                return;
            } else {
                let cloneUrl = new String(project.git_url);
                if (project.access_token) {
                    if (project.gitHost === 'github') {
                        cloneUrl = cloneUrl.replace("https://", `https://${project.access_token}@`);
                    } else {
                        cloneUrl = cloneUrl.replace("https://", `https://oauth2:${project.access_token}@`);
                    }
                }

                exec(`cd .. && mkdir -p projects && cd projects && git clone ${cloneUrl} ${project._id}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
            }
        });
    }

    async pullProject(project) {
        let cloneUrl = new String(project[0].git_url);

        exec(`cd ../projects/${project[0]._id} && git pull origin master`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

    async scheduler(data) {
        const project = this.getByLabel(data.projectName);
        
    } 
}

module.exports = new ProjectController();