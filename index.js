'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Add MongoDB connection

//Call the routes

app.listen(port, () => console.log(`Server started on ${port}...`));