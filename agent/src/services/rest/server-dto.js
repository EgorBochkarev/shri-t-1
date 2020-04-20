const axios = require('axios');

class ServerDTO {
  static async notify(agentUrl) {
    return ServerDTO.axiosInstance.get(`${ServerDTO.baseUrl}/notify-agent`, {
      params: {url: agentUrl}
    }).then(({data}) => data);
  }
  // {id, status, buildLog}
  static async finishedBuild(build) {
    return ServerDTO.axiosInstance.post(
        `${ServerDTO.baseUrl}/notify-build-result`,
        build
    ).then(({data}) => data);
  }
}

ServerDTO.baseUrl = 'http://127.0.0.1:8080';
ServerDTO.axiosInstance = axios.create();

module.exports = ServerDTO;
