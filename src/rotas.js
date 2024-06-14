const express = require('express');
const {cadastrarUsuario, login, editarUsuario} = require('./controller/usuarios');
const{autenticador} = require('./intermediary/autenticador');

const rotas = express();

rotas.get('/', (req, res) => {
    return res.json({msg: 'Servidor funcionando corretamente.'})
});

rotas.post('/usuarios', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(autenticador);

rotas.put('/usuarios',editarUsuario)

module.exports = rotas;