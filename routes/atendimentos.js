const { Router } = require('express');
const routes = Router();
const atendimentosController = require('../controllers/AtendimentosController');
const usuarioController  = require('../controllers/UsuariosController');
const loginController = require('../controllers/LoginController');
const empresasController = require('../controllers/EmpresasController');
const imageController = require('../controllers/imageController')

// multer config
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage})
const limitImage = 10

// Atendimentos
routes.get('/atendimentos', atendimentosController.readRecord);
routes.post('/atendimentos', upload.array('image', limitImage), atendimentosController.createRecord);
routes.post('/atendimentos/update', atendimentosController.updateRecord);

// Imagens
// routes.post('/imagens', upload.array('image', limitImage), imagensController.Inserir);
routes.post('/imagens/delete', imageController.deleteImage)
// routes.post('/imagens', imagensController.DeletarImagens);

// Usuarios
routes.get('/usuarios', usuarioController.readRecord);

// Login
routes.post('/login', loginController.Login);

// Empresas
routes.get('/empresas', empresasController.readRecord);
// routes.post('/empresas', empresasController.Inserir);
//routes.post('/empresas/update', empresasController.Atualizar);

module.exports = routes;