const knex = require('../infra/conexao');

const listarPosts = async (req, res) => {
    try {
        const listarPosts = await knex('posts').select('*');

        return res.status(200).json(listarPosts);
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor.' })
    }
}

const criarPost = async (req, res) => {
    const { titulo, conteudo } = req.body;

    try {
        const autor = req.usuario.username;
        const publicarPost = await knex('posts').insert({ autor, titulo, conteudo }).returning('*');

        return res.status(201).json(publicarPost[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

const postsUsuarios = async (req, res) => {
    usuario = req.usuario;

    try {
        const posts = await knex('posts').where({ username: usuario.username });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

const editarPost = async (req, res) => {
    const { titulo, conteudo } = req.body;
    const { id } = req.params;
    usuario = req.usuario;

    try {
        const post = await knex('posts').where({ id, username: usuario.username });

        if (post.length < 1) {
            return res.status(404).json({ mensagem: 'Não foi encontrado o post.' });
        }

        const atualizarPost = await knex('posts').where({ id }).update({ titulo, conteudo }).returning('*');

        return res.status(201).json(atualizarPost[0]);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

const excluirPost = async (req, res) => {
    const { id } = req.params;
    usuario = req.usuario;

    try {
        const post = await knex('posts').where({ id, username: usuario.username });

        if (post.length < 1) {
            return res.status(404).json({ mensagem: 'Não foi encontrado o post.' });
        }

        await knex('posts').where({ id }).del();

        return res.status(204).json({ mensagem: 'Post excluído com sucesso.' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

module.exports = {
    criarPost,
    editarPost,
    listarPosts,
    postsUsuarios,
    excluirPost
}