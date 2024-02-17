import Logger from './lib/core/Logger';
import { port } from './Config';
import app from './App';


app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => {
    Logger.error(e)});
