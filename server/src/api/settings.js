const path = require('path');
const ConfigService = require('../services/rest/conf-dto');
const TaskManager = require('../services/task-manager');

exports.initSettingsApi = (app, baseUrl) => {
  baseUrl = path.join(baseUrl, 'settings');

  app.get(baseUrl, (req, res) => {
    ConfigService.getConf().then((data) => {
      res.json(data);
    }).catch((e) => {
      console.log(e);
      res.status(500).json({
        error: 'CAN_NOT_GET_SETTINGS',
        message: 'Can\'t get settings'
      });
    });
  });

  app.post(baseUrl, (req, res) => {
    ConfigService.setConf(req.body).then((data) => {
      // Change validation
      if (req.body && req.body.period > 0) {
        TaskManager.start(req.body);
      }
      ConfigService.getConf().then((data) => {
        res.json(data);
      });
    });
  });
  app.delete(baseUrl, (req, res) => {
    ConfigService.deleteConf().then(() => {
      TaskManager.end();
      res.end();
    });
  });
};
