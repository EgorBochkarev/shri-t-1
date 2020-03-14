const path = require('path');
const ConfigService = require('../services/rest/conf-dto');

exports.initSettingsApi = (app, baseUrl) => {
    baseUrl = path.join(baseUrl, 'settings');

    app.get(baseUrl, (req, res) => {
        ConfigService.getConf().then((data) => {
            res.json(data)
        })
    });

    app.post(baseUrl, (req, res) => {
        ConfigService.setConf(req.body).then((data) => {
            ConfigService.getConf().then((data) => {
                res.json(data)
            })
        })
    })
    app.delete(baseUrl, (req, res) => {
        ConfigService.deleteConf().then(() => {
            res.end();
        })
    })
}