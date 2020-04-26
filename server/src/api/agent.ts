import AgentManager from '../services/agent-manager';
import AgentQueue from '../services/agent-queue';
import BuildDTO, { BuildFinish } from '../services/rest/build-dto';
import {Express} from "express-serve-static-core";

const initAgentApi = (app:Express, baseUrl:string) => {
  app.get<{},string, {}, {url:string}>(`${baseUrl}/notify-agent`, ({query}, res) => {
    res.end(AgentManager.registerAgentToQueue(query.url));
  });

  app.post<{agentId:string}, BuildFinish>(`${baseUrl}/notify-build-result/:agentId`, ({params, body}, res) => {
    AgentQueue.setAgentToQueue(params.agentId);
    BuildDTO.setBuildFinish(body);
    res.end();
  });
};

export {initAgentApi}
