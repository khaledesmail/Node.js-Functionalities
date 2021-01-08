const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  database
} = require('./utilities');
const router = require('./api/routes');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json())

// Database connection
database.connect();

// Enable cors 
app.use(cors());

// application Route
app.use(router);

module.exports = app;