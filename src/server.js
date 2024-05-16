require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations");

const AppError = require("./utils/AppError");

const express = require("express");

const  routes = require("./routes/");

migrationsRun();

const app = express();

app.use(express.json()); // Definindo o tipo de dado que irá receber

app.use(routes); // Use na aplicação estas rotas



app.use((error, request, repost, user, next) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    
    }

    console.error(error);

    response.status(500).json({
        status: "error",
        message:"Internal Server Error"
    })
});

const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));