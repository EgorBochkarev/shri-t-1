import axios from 'axios';

type BuildResult = {
  buildId:string,
  duration:number,
  success:boolean,
  buildLog:string
}

class ServerDTO {
  static baseUrl = 'http://127.0.0.1:8080'
  static agentId = 'defauilt'
  static axiosInstance = axios.create()
  static notify(agentUrl:string) {
    return ServerDTO.axiosInstance.get(`${ServerDTO.baseUrl}/notify-agent`, {
      params: {url: agentUrl}
    }).then(({data}) => data);
  }
  // {id, status, buildLog}
  static finishedBuild(build:BuildResult) {
    return ServerDTO.axiosInstance.post(
        `${ServerDTO.baseUrl}/notify-build-result/${ServerDTO.agentId}`,
        build
    ).then(({data}) => data);
  }
}

export default ServerDTO;
