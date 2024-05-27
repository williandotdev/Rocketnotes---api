const { verify } = require("jsonwebtoken"); // Importa a função verify do jsonwebtoken para verificar tokens JWT.
const AppError = require("../utils/AppError"); // Importa a classe de erro personalizado.
const authConfig = require("../configs/auth"); // Importa as configurações de autenticação.

function ensureAuthenticated(request, response, next) {
    // Obtém o token JWT do cabeçalho da solicitação.
    const authHeader = request.headers.authorization;

    // Verifica se o token JWT foi fornecido.
    if (!authHeader) {
        throw new AppError("JWT Token não informado", 401); // Lança um erro se o token não for fornecido.
    }

    // Divide o cabeçalho de autorização para obter o token.
    const [, token] = authHeader.split(" "); 
    try {
        // Verifica o token JWT usando o segredo definido nas configurações de autenticação.
        const { sub: user_id } = verify(token, authConfig.jwt.secret);
        
        // Define o ID do usuário no objeto de solicitação para uso posterior.
        request.user = {
            id: Number(user_id),
        };
        console.log(user_id)
        return next(); // Continua para o próximo middleware.
    } catch {
        throw new AppError("JWT Token inválido", 401); // Lança um erro se o token for inválido.
    }
}

module.exports = ensureAuthenticated; // Exporta a função ensureAuthenticated.
