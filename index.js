require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/atendimentos');
const app = express();
var cors = require('cors');

app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.listen(8080);