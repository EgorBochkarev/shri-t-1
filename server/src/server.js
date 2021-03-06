const Api = require('./api');
const path = require('path');
const express = require('express');

const baseUrl = '/api';
const app = express();

const startServer = function(port) {
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

exports.startServer = startServer;
