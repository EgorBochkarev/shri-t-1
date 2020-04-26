import Api from './api';
import path from 'path';
import express from 'express';

const baseUrl = '/api';
const app = express();

const startServer = function(port:number):void {
  app.use(express.json());
  const staticPath = path.resolve(
      __dirname, '..', '..', 'client', 'dist'
  );
  app.use(express.static(staticPath));
  app.get('/health', (req, res) => {
    res.end();
  });

  Api.initSettingsApi(app, baseUrl);
  Api.initBuildsApi(app, baseUrl);
  Api.initAgentApi(app, '');

  app.get('/*', (req, res) => {
    res.sendFile(staticPath + '/index.html');
  });

  app.listen(port);
};

export default {startServer}
