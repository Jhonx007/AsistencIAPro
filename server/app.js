
import express from 'express';


const app = express();


const port = 3000;


app.get('/', (res) => {

  res.send('¡Hola Mundo con Express!');
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});