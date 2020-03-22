const Api = require('./api');
const path = require('path');
const express = require('express');

const baseUrl = '/api';
const app = express();

const startServer = function(port) {
  app.use(express.json());
  app.use(express.static(path.resolve(__dirname, '..', 'dist')));

  Api.initSettingsApi(app, baseUrl);
  Api.initBuildsApi(app, baseUrl);

  app.listen(port);
};

exports.startServer = startServer;
