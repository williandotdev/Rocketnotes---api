const path = require("path"); // Importa o módulo path para trabalhar com caminhos de arquivos e diretórios.
const multer = require("multer"); // Importa o multer para lidar com upload de arquivos.
const crypto = require("crypto"); // Importa o crypto para gerar hashes aleatórios.

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp"); // Define o caminho para a pasta temporária.
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads"); // Define o caminho para a pasta de uploads dentro da pasta temporária.

// Configurações do multer para armazenamento dos arquivos.
const MULTER = {
    storage: multer.diskStorage({
        // Define o destino dos arquivos enviados.
        destination: TMP_FOLDER,
        // Define o nome dos arquivos enviados.
        filename(request, file, callback) {
            // Gera um hash aleatório para o nome do arquivo.
            const fileHash = crypto.randomBytes(10).toString("hex");
            // Concatena o hash gerado com o nome original do arquivo.
            const fileName = `${fileHash}-${file.originalname}`;

            // Retorna o nome do arquivo gerado.
            return callback(null, fileName);
        },
    }),
};

module.exports = {
    TMP_FOLDER, // Exporta o caminho da pasta temporária.
    UPLOADS_FOLDER, // Exporta o caminho da pasta de uploads.
    MULTER, // Exporta a configuração do multer.
}
