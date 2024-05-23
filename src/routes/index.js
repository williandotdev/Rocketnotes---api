const { Router } = require('express'); // Importa o módulo Router do Express.

// Importa os arquivos de rotas específicas para diferentes recursos da aplicação.
const usersRouter = require('./users.routes');
const notesRouter = require('./notes.routes');
const tagsRouter = require('./tags.routes');
const sessionsRouter = require('./sessions.routes');

const routes = Router(); // Cria uma instância do Router do Express.

// Define os pontos de entrada para diferentes recursos da aplicação.
routes.use('/users', usersRouter); // Rota para manipular operações de usuários.
routes.use('/notes', notesRouter); // Rota para manipular operações de notas.
routes.use('/tags', tagsRouter); // Rota para manipular operações de tags.
routes.use('/sessions', sessionsRouter); // Rota para manipular operações de sessões.

module.exports = routes; // Exporta as rotas configuradas para serem utilizadas na aplicação.
