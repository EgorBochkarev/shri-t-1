import axios from 'axios';
import {PositiveResponce} from '../../../../agent/src/api/agent'

class AgentDTO {
  baseURL:string;
  constructor(baseURL:string) {
    this.baseURL = baseURL;
  }
  build(id:string, commitHash:string, repoName:string, buildCommand:string) {
    return axios.post<PositiveResponce>(`${this.baseURL}/build`, {}, {
      params: {id, commitHash, repoName, buildCommand}
    }).then(({data}) => data);
  }
}

export default AgentDTO;
