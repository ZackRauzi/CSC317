import express from 'express';
import exercisesRoute from './routes/api/exercises.js';
import dotenv from "dotenv";
dotenv.config();




const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());



//ROUTES
app.get('/', (req, res) => {
    console.log('Homepage');
    res.render('index');
})

app.use('/exercise', exercisesRoute);

app.get('/routine', (req, res) => {
    console.log('routine');
    res.json({ message: 'Error' });
})


//ERROR HANDLING
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
})


//PORT CONFIG
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})


