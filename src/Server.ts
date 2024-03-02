import Logger from './lib/core/Logger';
import { port } from './Config';
import app from './App';


process.on('uncaughtException', (e) => {
  Logger.error(e.message);
});
app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => {
    Logger.error(e)});
