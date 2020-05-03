const SettingsApi = require('./settings');
const BuildsApi = require('./builds');
const AgentApi = require('./agent');

exports.initSettingsApi = SettingsApi.initSettingsApi;
exports.initBuildsApi = BuildsApi.initBuildsApi;
exports.initAgentApi = AgentApi.initAgentApi;
