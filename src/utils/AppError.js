class AppError {
    // Construtor da classe AppError.
    // Aceita uma mensagem de erro e um código de status HTTP (padrão é 400 - Bad Request).
    constructor(message, statusCode = 400) {
        // Converte a mensagem para JSON se for um objeto, senão mantém a mensagem como está.
        this.message = typeof message === 'object' ? JSON.stringify(message) : message;
        // Define o código de status HTTP para o erro.
        this.statusCode = statusCode;
    }
}

// Exporta a classe AppError para ser utilizada em outros arquivos.
module.exports = AppError;
