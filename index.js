require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/atendimentos');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument  = require('./swagger/swagger.json')
const {expressjwt} = require('express-jwt')

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(expressjwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"]
}).unless({path: ['/login']}))
app.use(routes);

app.listen(process.env.PORT, ()=>{
    console.log(`servidor rodando na porta: ${process.env.PORT}`);
});