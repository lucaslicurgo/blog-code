const knex = require('../infra/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    const { username, email, senha } = req.body;

    try {
        const usernameExistente = await knex('usuarios').where({ username }).first();

        if (usernameExistente) {
            return res.status(401).json({ mensagem: 'Username já existente.' });
        }

        const emailExistente = await knex('usuarios').where({ email }).first();

        if (emailExistente) {
            return res.status(401).json({ mensagem: 'E-mail já existente.' });
        }

        const senhaCrypt = await bcrypt.hash(senha, 10);

        const cadastro = await knex('usuarios').insert({ username, email, senha: senhaCrypt }).returning(["id", "username", "email"]);

        return res.status(201).json(cadastro[0]);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

const login = async (req, res) => {
    const { username, email, senha } = req.body;

    try {
        if (!username) {
            const usuario = await knex('usuarios').where({ email }).first();
            if (!usuario) {
                return res.status(400).json({ mensagem: 'E-mail ou senha incorretos. Tente novamente.' });
            }

            const senhaCrypt = await bcrypt.compare(senha, usuario.senha);
            if (!senhaCrypt) {
                return res.status(400).json({ mensagem: 'E-mail ou senha incorretos. Tente novamente.' });
            }

            const token = jwt.sign({ id: usuario.id }, process.env.SENHA_HASH, { expiresIn: '1h' });

            return res.json({ token: token });
        }

        const usuario = await knex('usuarios').where({ username }).first();
        if (!usuario) {
            return res.status(400).json({ mensagem: 'Username ou senha incorretos. Tente novamente.' });
        }

        const senhaCrypt = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCrypt) {
            return res.status(400).json({ mensagem: 'Username ou senha incorretos. Tente novamente.' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.SENHA_HASH, { expiresIn: '1h' });

        return res.json({ token: token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

const editarUsuario = async (req, res) => {
    const { username, email, senha } = req.body;
    usuario = req.usuario;

    try {

        if (email && email !== req.usuario.email) {
            const emailExistente = await knex('usuarios').where({ email }).first();

            if (emailExistente) {
                return res.status(400).json({ mensagem: 'E-mail já existente.' });
            }
        }

        const dadosAtualizados = {};
        if (username) dadosAtualizados.username = username;
        if (email) dadosAtualizados.email = email;
        if (senha) {
            const senhaCrypt = await bcrypt.hash(senha, 10);
            dadosAtualizados.senha = senhaCrypt;
        }

        if (Object.keys(dadosAtualizados).length > 0) {
            await knex('usuarios').where('id', req.usuario.id).update(dadosAtualizados);
            return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
        } else {
            return res.status(400).json({ mensagem: 'Nenhum dado para atualizar.' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }

};

module.exports = {
    cadastrarUsuario,
    login,
    editarUsuario
};
