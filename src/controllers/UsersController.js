const { hash, compare } = require("bcryptjs"); // Importa as funções hash e compare do bcryptjs para manipulação de senhas.
const AppError = require("../utils/AppError"); // Importa a classe de erro personalizado.
const sqliteConnection = require('../database/sqlite'); // Importa o módulo de conexão com o SQLite.
const knex = require("../database/knex")
class UsersController {
    /**  
    * Index - GET Listar vários Registros
    * show - GET para exibir um Registro específico.
    * create - POST criar um registro.
    * update - POST atualizar um registro.
    * delete - DELETE para remover um registro.
    */

   // Método para criar um novo usuário.
   async create(request, response) {
       
        const { name, email, password } = request.body;// Extrai os dados do corpo da solicitação.
       
        const database = await sqliteConnection(); // Estabelece uma conexão com o banco de dados SQLite.

        const checkUserExists = await database.get("SELECT * FROM users where email = (?)", [email]); // Verifica se já existe um usuário com o mesmo e-mail no banco de dados.
        
        if (checkUserExists) {// Se o usuário já existe, lança um erro.
            throw new AppError("Este e-mail já está em uso.");
        }
        const hashedPassword = await hash(password, 8);// Criptografa a senha do usuário antes de armazená-la no banco de dados.
        
        
await database.run("INSERT INTO users (name, email, password) VALUES(?,?,?)", [name, email, hashedPassword]);// Insere um novo usuário no banco de dados com a senha criptografada.       
        return response.status(201).json(); // Retorna uma resposta indicando que o usuário foi criado com sucesso.
    }

    // Método para atualizar um usuário existente.
    async update(request, response) {
        
        const { name, email, password, old_password } = request.body;// Extrai os dados do corpo da solicitação.
        const user_id = request.user.id;// Obtém o ID do usuário autenticado.
        const database = await sqliteConnection();// Estabelece uma conexão com o banco de dados SQLite.
        //const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);// Obtém o usuário com o ID fornecido.
        const user = await knex("users").where({ id: user_id }).first();
        
        if (!user) {// Se o usuário não for encontrado, lança um erro.
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);// Verifica se o novo e-mail já está em uso por outro usuário.

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {// Se o e-mail já está em uso por outro usuário, lança um erro.
            throw new AppError("Este e-mail já está em uso.");
        }

        // Atualiza o nome e o e-mail do usuário se fornecidos, senão mantém os antigos.
        user.name = name ?? user.name;
        user.email = email ?? user.email;

        // Se a nova senha for fornecida, mas a senha antiga não, lança um erro.
        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para alterar.");
        }

        // Se ambas as senhas (nova e antiga) forem fornecidas, verifica e atualiza.
        if (password && old_password) {
            // Verifica se a senha antiga está correta.
            const checkOldPassword = await compare(old_password, user.password);
            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere!");
            }

            // Criptografa a nova senha e a atualiza no usuário.
            user.password = await hash(password, 8);
        }

        // Atualiza os dados do usuário no banco de dados.
        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`, 
            [user.name, user.email, user.password, user_id]
        );

        // Retorna uma resposta indicando que o usuário foi atualizado com sucesso.
        return response.json();
    }
}

module.exports = UsersController; // Exporta a classe UsersController.
