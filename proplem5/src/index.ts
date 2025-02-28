import './mongodb';
import 'body-parser'
import express, { Application, Request, Response } from 'express';
import path from 'path';


const app: Application = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

import userRouter from '../routes/user.routes';
app.use('/users', userRouter);
// run
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
