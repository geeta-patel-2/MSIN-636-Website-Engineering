import express from 'express';
import cors from 'cors'; //Enable Cross origin Resource sharing
import morgan from 'morgan';// Logging
import taskRouter from './routes/taskRoutes.js';

const app = express();

//Middleware
app.use(express.json());
app.use(cors())
app.use(morgan('dev'))

//Routes
app.use('/api/tasks', taskRouter);
export default app;
