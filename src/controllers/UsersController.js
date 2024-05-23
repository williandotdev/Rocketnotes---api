const { hash, compare } = require("bcryptjs"); // Importa a função hash do bcryptjs para criptografar senhas.

const AppError = require("../utils/AppError"); // Importa o módulo de erro personalizado.

const sqliteConnection = require('../database/sqlite'); // Importa o módulo de conexão com o SQLite.

class UsersController {
    /**  
    * Index - GET Listar vários Registros
    * show - GET para exibir um Registro específico.
    * create - POST criar um registro.
    * update - POST atualizar um registro.
    * delete - DELETE para remover um registro.
    */

   async create(request, response){
    // Extrai os dados do corpo da solicitação.
    const {name, email, password} = request.body;

    // Estabelece uma conexão com o banco de dados SQLite.
    const database = await sqliteConnection();

    // Verifica se já existe um usuário com o mesmo e-mail no banco de dados.
    const checkUserExists = await database.get("SELECT * FROM users where email = (?)", [email]);

    // Se o usuário já existe, lança um erro.
    if (checkUserExists){
        throw new AppError("Este e-mail já está em uso.");
    }

    // Criptografa a senha do usuário antes de armazená-la no banco de dados.
    const hashedPassword = await hash(password, 8);

    // Insere um novo usuário no banco de dados com a senha criptografada.
    await database.run("INSERT INTO users (name, email, password) VALUES(?,?,?)", [name, email, hashedPassword]);

    // Retorna uma resposta indicando que o usuário foi criado com sucesso.
    return response.status(201).json();
}

    async update(request, response) {
     const { name, email, password, old_password } = request.body
     const user_id = request.user.id

     const database = await sqliteConnection()
     const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

     if(!user) {
      throw new AppError("Usuário não encontrado")
     }

     const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

     if(userWithUpdatedEmail && userWithUpdatedEmail.id !== id) {
      throw new AppError("Este e-mail já está em uso.")
     }

     user.name = name ?? user.name;
     user.email= email ?? user.email;

    if(password && !old_password) {
         throw new AppError("Você precisa informar a senha antiga para alterar.");
     }


    if( password && old_password){
        const checkOldPassword = await compare(old_password, user.password);
        if(!checkOldPassword){
            throw new AppError("A senha antiga não confere!");
        }

        user.password = await hash(password, 8);
    }

     await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`, 
      [user.name, user.email,user.password, user_id]
    )

    return response.json()
  }
}



module.exports = UsersController; // Exporta a classe UsersController.
