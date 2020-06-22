'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const RouterBuilder = require('./routes');

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Add MongoDB connection
mongoose
    .connect(process.env.DB_CONNECT,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    .then(() => console.log("Connected to database!"))
    .catch(() => console.error("Database connection failed!"));

RouterBuilder.build(app)

app.listen(port, () => console.log(`Server started on ${port}...`));