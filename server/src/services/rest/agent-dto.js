const axios = require('axios');

class AgentDTO {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  build(id, commitHash, repoName, buildCommand) {
    return axios.post(`${this.baseURL}/build`, {}, {
      params: {id, commitHash, repoName, buildCommand}
    }).then(({data}) => data);
  }
}

module.exports = AgentDTO;
