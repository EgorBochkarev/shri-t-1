import express from 'express';
import {initBuildsApi} from './api/agent';

const app = express();

const startServer = function(port:string):void {
  app.use(express.json());
  app.get('/health', (req, res) => {
    res.end();
  });
  initBuildsApi(app);
  app.listen(port);
};

export default {startServer};
