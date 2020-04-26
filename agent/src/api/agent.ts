import path from 'path';
import Builder, {BuildRequest} from '../builder/builder';
import {Express} from "express-serve-static-core";

export type PositiveResponce = {
  status:'ok'
}

const initBuildsApi = (app:Express, baseUrl:string = '/'):void => {
  baseUrl = path.join(baseUrl, 'build');

  app.post<{},PositiveResponce, {}, BuildRequest>(baseUrl, ({query: buildRequest}, res) => {
    Builder.build(buildRequest).then(() => {
      res.json({
        status: 'ok'
      });
    });
  });
};

export {initBuildsApi}
