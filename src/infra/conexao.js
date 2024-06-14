const knex = require('knex')({
    client: 'pg',
    connection:{
        host: 'localhost',
        user: 'postgres',
        password: '123456',
        database: 'chat_code'
    }
});

module.exports = knex;