const knex = require("../database/knex"); // Importa o módulo de conexão com o banco de dados Knex.
const AppError = require("../utils/AppError"); // Importa a classe de erro personalizado.
const { compare } = require("bcryptjs"); // Importa a função compare do bcryptjs para comparar senhas.
const authConfig = require("../configs/auth"); // Importa as configurações de autenticação.
const { sign } = require("jsonwebtoken"); // Importa a função sign do jsonwebtoken para gerar tokens JWT.

class SessionsController {
    // Método para criar uma sessão (login).
    async create(request, response) {
        // Extrai os dados do corpo da solicitação.
        const { email, password } = request.body;

        // Busca o usuário no banco de dados pelo e-mail.
        const user = await knex("users").where({ email }).first();

        // Se o usuário não for encontrado, lança um erro de autenticação.
        if (!user) {
            throw new AppError("E-mail e/ou senha incorreta!", 401);
        }

        // Compara a senha fornecida com a senha armazenada no banco de dados.
        const passwordMatched = await compare(password, user.password);

        // Se as senhas não coincidirem, lança um erro de autenticação.
        if (!passwordMatched) {
            throw new AppError("E-mail e/ou senha incorreta!", 401);
        }

        // Extrai as configurações do JWT (segredo e tempo de expiração).
        const { secret, expiresIn } = authConfig.jwt;
        // Gera um token JWT para o usuário autenticado.
        const token = sign({}, secret, {
            subject: String(user.id), // Define o ID do usuário como sujeito do token.
            expiresIn // Define o tempo de expiração do token.
        });

        // Retorna a resposta com os dados do usuário e o token gerado.
        return response.json({ user, token });
    }
}

module.exports = SessionsController; // Exporta a classe SessionsController.
