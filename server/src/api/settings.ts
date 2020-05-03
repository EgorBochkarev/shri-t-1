import path from 'path';
import ConfigService, { Configuration } from '../services/rest/conf-dto';
import TaskManager from '../services/task-manager';
import {Express} from "express-serve-static-core";

export type ApiResult<T> = {
  error:string,
  message:string
} | T

export type EmptyObject = {}


const initSettingsApi = (app:Express, baseUrl:string):void => {
  baseUrl = path.join(baseUrl, 'settings');

  app.get<{},ApiResult<Configuration> | EmptyObject>(baseUrl, (req, res) => {
    ConfigService.getConf().then((data) => {
      res.json(data ? data : {});
    }).catch((e) => {
      console.log(e);
      res.status(500).json({
        error: 'CAN_NOT_GET_SETTINGS',
        message: 'Can\'t get settings'
      });
    });
  });

  app.post<{},ApiResult<Configuration>, Configuration>(baseUrl, ({body}, res) => {
    ConfigService.setConf(body).then(() => {
      // Change validation
      if (body && body.period > 0) {
        TaskManager.start(body);
      }
      ConfigService.getConf().then((data) => {
        res.json(data);
      });
    });
  });
  app.delete(baseUrl, (req, res) => {
    ConfigService.deleteConf().then(() => {
      TaskManager.end();
      res.end();
    });
  });
};

export {initSettingsApi}
