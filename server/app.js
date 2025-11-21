import express from 'express';
import routes from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(express.json());


const port = 3000;


app.get('/', (res) => {

  res.send('¡Hola Mundo con Express!');
});

app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});