const { Router } = require('express');
const routes = Router();
const controllers = require('../controllers/AtendimentosController');


routes.get('/atendimentos', controllers.Consultar);
routes.post('/atendimentos', controllers.Inserir);
routes.post('/atendimentos/update', controllers.Atualizar);

module.exports = routes;