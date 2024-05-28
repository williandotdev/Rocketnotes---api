require("express-async-errors"); // Habilita o tratamento de erros assíncronos no Express.
require("dotenv/config");

const migrationsRun = require("./database/sqlite/migrations"); // Importa e executa as migrações do banco de dados SQLite.
const AppError = require("./utils/AppError"); // Importa a classe de erro personalizado.
const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express"); // Importa o módulo Express.
const routes = require("./routes/"); // Importa as rotas definidas na aplicação.

migrationsRun(); // Executa as migrações do banco de dados.

const app = express(); // Cria uma instância do Express.

app.use(cors());

app.use(express.json()); // Define o middleware para parsear JSON no corpo das requisições.

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes); // Usa as rotas importadas na aplicação.


// Middleware para tratamento de erros.
app.use((error, request, response, next) => {
    // Verifica se o erro é uma instância de AppError (erro personalizado).
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    // Se não for um erro personalizado, loga o erro no console.
    console.error(error);

    // Retorna uma resposta de erro genérico.
    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
});

const PORT = process.env.PORT || 3333; // Define a porta onde o servidor vai rodar.

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`)); // Inicia o servidor e escuta na porta definida.
