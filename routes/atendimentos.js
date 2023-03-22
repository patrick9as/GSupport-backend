const { Router } = require('express');
const routes = Router();
const atendimentosController = require('../controllers/AtendimentosController');
const usuarioController  = require('../controllers/UsuariosController');
const loginController = require('../controllers/LoginController');


routes.get('/atendimentos', atendimentosController.Consultar);
routes.post('/atendimentos', atendimentosController.Inserir);
routes.post('/atendimentos/update', atendimentosController.Atualizar);

// Usuarios
routes.get('/usuarios', usuarioController.Consultar);

// Login
routes.post('/login', loginController.Login);

module.exports = routes;