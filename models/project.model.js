'use strict';
const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    label: {
        type: String
    },
    git_url: {
        type: String,
        unique: true,
        required: true
    },
    access_token: {
        type: String,
        unique: false
    },
    git_host: {
        type: String,
        enum: ['github', 'gitlab'],
        required: true
    },
    branches: {
        type: [String]
    },
    storage_url: {
        type: String
    },
    enable: {
        type: Boolean
    }
});

module.exports = mongoose.model('Project', projectSchema);
