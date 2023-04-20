const { Router } = require('express');
const routes = Router();
const atendimentosController = require('../controllers/AtendimentosController');
const usuarioController  = require('../controllers/UsuariosController');
const loginController = require('../controllers/LoginController');
const empresasController = require('../controllers/EmpresasController');

// multer config
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage})
const limitImage = 10

routes.get('/atendimentos', atendimentosController.Consultar);
routes.post('/atendimentos', upload.array('image', limitImage), atendimentosController.Inserir);
routes.post('/atendimentos/update', atendimentosController.Atualizar);

// Usuarios
routes.get('/usuarios', usuarioController.Consultar);

// Login
routes.post('/login', loginController.Login);

// Empresas
// routes.get('/empresas', empresasController.Consultar);
// routes.post('/empresas', empresasController.Inserir);
//routes.post('/empresas/update', empresasController.Atualizar);

module.exports = routes;