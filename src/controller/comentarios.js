const knex = require('../infra/conexao');

const adicionarComentario = async (req, res) => {
    const { comentario } = req.body;
    const { id: postId } = req.params;
    const { usuario } = req;

    try {
        const post = await knex('posts').where({ id: postId });

        if (!post) {
            return res.status(404).json({ mensagem: "Post não encontrado." })
        }
        const [novoComentario] = await knex('comentarios').insert({ autor: usuario.username, comentario, postid: postId }).returning(["autor", "comentario"]);

        return res.status(201).json({ post, comentario: novoComentario });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

const listarComentarios = async (req, res) => {
    const { id: postId } = req.params;

    try {
        const comentarios = await knex('comentarios').where({ postid: postId });
        return res.status(200).json(comentarios);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

const editarComentario = async (req, res) => {
    const { id } = req.params;
    const { usuario } = req;
    const { comentario } = req.body;

    try {
        const comentarioExistente = await knex('comentarios').where({ id });

        if (!comentarioExistente) {
            return res.status(404).json({ mensagem: 'Comentário não encontrado.' });
        }

        if (comentarioExistente[0].autor !== usuario.username) {
            console.log(comentarioExistente.autor, usuario.username);
            return res.status(404).json({ mensagem: 'Você não possui permissão para editar esse comentário.' })
        }

        const comentarioAtualizado = await knex('comentarios').where({ id }).update({ comentario }).returning(["autor", "comentario", "postid"]);

        return res.status(200).json(comentarioAtualizado[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

const excluirComentario = async (req, res) => {
    const { id } = req.params;
    const { usuario } = req;

    try {
        const comentarioExistente = await knex('comentarios').where({ id });

        if (!comentarioExistente) {
            return res.status(404).json({ mensagem: 'Comentário não encontrado.' });
        }

        if (comentarioExistente[0].autor !== usuario.username) {
            return res.status(404).json({ mensagem: 'Você não possui permissão para excluir esse comentário.' });
        }

        await knex('comentarios').where({ id }).del();
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

module.exports = {
    adicionarComentario,
    listarComentarios,
    editarComentario,
    excluirComentario
}