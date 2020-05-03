const express = require('express');
const {initBuildsApi} = require('./api/agent');
const app = express();

const startServer = function(port) {
  app.use(express.json());
  app.get('/health', (req, res) => {
    res.end();
  });
  initBuildsApi(app);
  app.listen(port);
};

exports.startServer = startServer;
