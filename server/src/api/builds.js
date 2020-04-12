const path = require('path');
const BuildDTO = require('../services/rest/build-dto');
const Builder = require('../builder/builder');
const Convert = require('ansi-to-html');
const convert = new Convert({
  fg: '#FFF',
  bg: '#000',
  newline: true,
  escapeXML: false,
  stream: false
});

exports.initBuildsApi = (app, baseUrl) => {
  baseUrl = path.join(baseUrl, 'builds');

  app.get(baseUrl, (req, res) => {
    BuildDTO.getBuildList(req.query.offset, req.query.limit).then(({data}) => {
      res.json(data);
    }).catch((error) => {
      res.status(500).json({
        error: 'NO_SETTINGS',
        message: 'Try to set settings first',
      });
    });
  });

  app.get(`${baseUrl}/:buildId`, (req, res) => {
    BuildDTO.getBuildDetails(req.params.buildId).then((build) => {
      res.json(build);
    }).catch((error) => {
      res.status(404).json({
        error: 'BUILD_NOT_FOUND',
        message: `Can not find build with id: ${req.params.buildId}`,
      });
    });
  });

  app.get(`${baseUrl}/:buildId/logs`, (req, res) => {
    BuildDTO.getBuildLog(req.params.buildId).then((logs) => {
      res.send(logs);
    });
  });

  app.get(`${baseUrl}/:buildId/logs/html`, (req, res) => {
    BuildDTO.getBuildLog(req.params.buildId).then((logs) => {
      res.send(convert.toHtml(logs));
    });
  });

  app.post(`${baseUrl}/:commitHash`, (req, res) => {
    Builder.setToQueue(req.params.commitHash).then((build) => {
      res.json(build);
    });
  });
};
