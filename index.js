require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/atendimentos');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.listen(process.env.PORT, ()=>{
    console.log(`servidor rodando na porta: ${process.env.PORT}`);
});