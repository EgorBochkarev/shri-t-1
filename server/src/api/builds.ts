import path from 'path';
import BuildDTO, { Build } from '../services/rest/build-dto';
import AgentManager from '../services/agent-manager';
import {Express} from "express-serve-static-core";
import Convert from 'ansi-to-html';
import { ApiResult } from './settings';
const convert = new Convert({
  fg: '#FFF',
  bg: '#000',
  newline: true,
  escapeXML: false,
  stream: false
});

const initBuildsApi = (app:Express, baseUrl:string) => {
  baseUrl = path.join(baseUrl, 'builds');

  app.get<{}, ApiResult<Build[]>, {}, {offset:string, limit:string}>(baseUrl, ({query: {offset, limit}}, res) => {
    BuildDTO.getBuildList(offset, limit).then(({data}) => {
      res.json(data);
    }).catch(() => {
      res.status(500).json({
        error: 'NO_SETTINGS',
        message: 'Try to set settings first',
      });
    });
  });

  app.get<{buildId:string}, ApiResult<Build>>(`${baseUrl}/:buildId`, ({params}, res) => {
    BuildDTO.getBuildDetails(params.buildId).then((build) => {
      res.json(build);
    }).catch(() => {
      res.status(404).json({
        error: 'BUILD_NOT_FOUND',
        message: `Can not find build with id: ${params.buildId}`,
      });
    });
  });

  app.get<{buildId:string}, string>(`${baseUrl}/:buildId/logs`, ({params}, res) => {
    BuildDTO.getBuildLog(params.buildId).then((logs) => {
      res.send(logs);
    });
  });

  app.get<{buildId:string}, string>(`${baseUrl}/:buildId/logs/html`, ({params}, res) => {
    BuildDTO.getBuildLog(params.buildId).then((logs) => {
      res.send(convert.toHtml(logs));
    });
  });

  app.post<{commitHash:string},ApiResult<Build>>(`${baseUrl}/:commitHash`, ({params}, res) => {
    AgentManager.setToQueue(params.commitHash).then((build) => {
      res.json(build);
    }).catch(() => {
      res.status(500).json({
        error: 'BUILD_RUN_ERROR',
        message: 'Fail to run build',
      });
    });
  });
};

export {initBuildsApi}
