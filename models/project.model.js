'use strict';
const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    label: {
        type: String
    },
    git_url: {
        type: String
    },
    storage_url: {
        type: String
    }
});

module.exports = mongoose.model('Project', projectSchema);
