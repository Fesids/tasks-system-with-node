
const dotenv = require("dotenv");
//dotenv.config({ path: "./config.env" });
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("UncaughtException! 💥 Derrubando a aplicação...", err);
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");


const server = app.listen(process.env.PORT, () =>
  console.log(`O Servidor está rodando na porta ${process.env.PORT}`)
);


process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Derrubando a aplicação...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
