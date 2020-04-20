const path = require('path');
const Builder = require('../builder/builder');

exports.initBuildsApi = (app, baseUrl = '/') => {
  baseUrl = path.join(baseUrl, 'build');

  app.post(baseUrl, ({query: {id, commitHash, repoName, buildCommand}}, res) => {
    Builder.build(id, commitHash, repoName, buildCommand).then(() => {
      res.json({
        status: 'ok'
      });
    });
  });
};
