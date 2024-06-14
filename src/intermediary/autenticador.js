const jwt = require('jsonwebtoken');
const knex = require('../infra/conexao');

const autenticador = async(req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({mensagem: 'Não autorizado: faça o login para acessar!'});
    }

    const token = authorization.split(" ")[1];

    try {
        const tokenDecodificado = jwt.verify(token, process.env.SENHA_HASH);

        if(!tokenDecodificado){
            return res.status(401).json({mensagem: 'Token inválido! Por favor, faça o login novamente.'})
        }

        const usuarioExistente = await knex('usuarios').where({id: tokenDecodificado.id}).returning(["id", "username", "email"]);

        if(!usuarioExistente){
            return res.status(401).json({mensagem: 'Cadastro não encontrado.'});
        }

        const {senha:_, ...usuario} = usuarioExistente[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(500).json({erro: 'Erro interno do servidor.'});
    }
}

module.exports = {
    autenticador
}