const { Router } = require('express');
const routes = Router();
const atendimentosController = require('../controllers/AtendimentosController');
const usuarioController  = require('../controllers/UsuariosController');
const loginController = require('../controllers/LoginController');
const uploadImage = require('../controllers/uploadImage');

// multer config
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage})

routes.get('/atendimentos', atendimentosController.Consultar);
routes.post('/atendimentos', upload.array('image', 10), atendimentosController.Inserir);
routes.post('/atendimentos/update', atendimentosController.Atualizar);

// Usuarios
routes.get('/usuarios', usuarioController.Consultar);

// Login
routes.post('/login', loginController.Login);

module.exports = routes;