const AgentManager = require('../services/agent-manager');
const AgentQueue = require('../services/agent-queue');
const BuildDTO = require('../services/rest/build-dto');

exports.initAgentApi = (app, baseUrl) => {
  app.get(`${baseUrl}/notify-agent`, ({query}, res) => {
    res.end(AgentManager.registerAgentToQueue(query.url));
  });

  app.post(`${baseUrl}/notify-build-result/:agentId`, ({params, body}, res) => {
    AgentQueue.setAgentToQueue(params.agentId);
    BuildDTO.setBuildFinish(body);
    res.end();
  });
};
