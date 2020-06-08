'use strict';
require('dotenv').config();

const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 3000;

const RouterBuilder = require('./routes');

const app = express();

//app.use(bodyParser.json());
app.use(cors());

RouterBuilder.build(app)

//Add MongoDB connection

//Call the routes
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

app.listen(port, () => console.log(`Server started on ${port}...`));