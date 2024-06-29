const { Router } = require('express');
const { cadastrarUsuario, login, editarUsuario } = require('./controller/usuarios');
const { criarPost, editarPost, listarPosts, excluirPost } = require('./controller/posts');
const { adicionarComentario, listarComentarios, editarComentario, excluirComentario } = require('./controller/comentarios');
const { autenticador } = require('./intermediary/autenticador');

const rotas = Router();

rotas.post('/usuarios', cadastrarUsuario);
rotas.post('/login', login);
rotas.get('/posts', listarPosts);
rotas.get('/posts/:id/comentarios', listarComentarios);

rotas.use(autenticador);

rotas.put('/usuarios', editarUsuario);

rotas.post('/posts', criarPost);
rotas.put('/posts/:id', editarPost);
rotas.delete('/posts/:id', excluirPost);
rotas.post('/posts/:id/comentarios', adicionarComentario);
rotas.put('/posts/:postId/comentarios/:id', editarComentario);
rotas.delete('/posts/:postId/comentarios/:id', excluirComentario);

module.exports = rotas;