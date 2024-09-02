import 'module-alias/register.js';
import express, { Request, Response, NextFunction } from 'express';
import Logger from 'src/lib/core/Logger';
import cors from 'cors';
import { corsUrl } from 'src/Config';
// import './lib/database'; // initialize database
// import './lib/cache'; // initialize cache
import { NotFoundError } from 'src/lib/http/custom_error/ApiError';
import router from 'src/Route';
import { ResponseError } from 'src/lib/http/Response';
import { startAllCronJobs } from 'src/lib/cron';

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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return ResponseError(err, res);
});

startAllCronJobs();

export default app;
