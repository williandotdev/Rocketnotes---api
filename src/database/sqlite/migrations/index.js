const sqliteConnection = require('../../sqlite'); //Importando a conexão 
const createUsers = require('./createUsers'); // Importando a criação da tabela

async function migrationsRun(){
    const schemas = [
        createUsers
    ].join('');

    sqliteConnection().then(db => db.exec(schemas)).catch(error=>console.error(error));
}

module.exports = migrationsRun;