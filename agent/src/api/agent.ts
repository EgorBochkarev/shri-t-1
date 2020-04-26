import path from 'path';
import Builder from '../builder/builder';
import {Express} from "express-serve-static-core";

const initBuildsApi = (app:Express, baseUrl:string = '/'):void => {
  baseUrl = path.join(baseUrl, 'build');

  app.post(baseUrl, ({query: {id, commitHash, repoName, buildCommand}}, res) => {
    Builder.build(id as string, commitHash as string, repoName as string, buildCommand as string).then(() => {
      res.json({
        status: 'ok'
      });
    });
  });
};

export {initBuildsApi}
