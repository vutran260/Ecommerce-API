import express, { Request, Response, NextFunction } from 'express';
import Logger from './lib/core/Logger';
import cors from 'cors';
import { corsUrl, environment } from './Config';
// import './lib/database'; // initialize database
// import './lib/cache'; // initialize cache
import {
  NotFoundError,
} from './lib/http/custom_error/ApiError';
import router from './Route';
import { ResponseError } from './lib/http/Response';
import { startAllCronJobs } from './lib/cron';


process.on('uncaughtException', (e) => {
  Logger.error(e.message);
});

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Routes
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return ResponseError(err, res)
});

startAllCronJobs();

export default app;
