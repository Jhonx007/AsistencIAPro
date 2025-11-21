import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import materiaRouter from './modules/materia/materia.routers.js';
import routes from "./routes/index.js";
dotenv.config();



const app = express();

app.use(express.json());


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('¡Hola Mundo con Express!');
});

app.use('/api/materias', materiaRouter);
app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});