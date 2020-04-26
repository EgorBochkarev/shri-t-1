import SecurityService from '../oauth2/security-service';
import NodeCache from 'node-cache';
import CommitModel from '../../models/commit-model';
import {Data} from './conf-dto';

export type BuildRequest = {
  commitMessage:string
  commitHash:string
  branchName:string
  authorName:string
}

export type BuildRequestResponce = {
  id: string
  buildNumber: number,
  status: BuildStatus
}

export type BuildStart = {
  buildId:string
  dateTime:string
}

export type BuildFinish = {
  buildId: string
  duration: number,
  success: boolean,
  buildLog: string
}

export type Build = {
  configurationId:string
  start?:string
  duration?:string
  log?:string
} & BuildRequest & BuildRequestResponce

export enum BuildStatus {
  waiting = 'Waiting',
  inProgress = 'InProgress',
  success = 'Success',
  fail = 'Fail',
  canceled = 'Canceled'
}

class BuildDTO extends SecurityService {
  static logCache = new NodeCache({
    stdTTL: 3600,
    maxKeys: 200,
  });
  static baseUrl = 'https://hw.shri.yandex/api/build';
  static async getBuildList(offset?:string, limit?:string) {
    const { data } = await SecurityService.axiosInstance.get<Data<Build[]>>(`${BuildDTO.baseUrl}/list`, {
      params: { offset, limit }
    });
    return data;
  }

  static async getBuildLog(buildId:string) {
    let log;
    if (BuildDTO.logCache.has(buildId)) {
      log = BuildDTO.logCache.get<string>(buildId);
    }
    return log || SecurityService.axiosInstance.get<string>(`${BuildDTO.baseUrl}/log`, {
      params: {
        buildId
      }
    }).then(({data}) => {
          try {
            BuildDTO.logCache.set(buildId, data);
          } catch (e) {
            console.log('Cashe limit was succed');
          }
          return data;
        });
  }

  static async getBuildDetails(buildId:string) {
    return SecurityService.axiosInstance.get<Data<Build>>(`${BuildDTO.baseUrl}/details`, {
      params: {buildId}
    }).then(({data}) => {
      if (!data.data) {
        throw Error()
      }
      return data.data;
    });
  }

  static async setBuildRequest(request:CommitModel) {
    return SecurityService.axiosInstance.post<Data<BuildRequestResponce>>(
        `${BuildDTO.baseUrl}/request`,
        request
    ).then(({data}) => {
      if (!data.data) {
        throw Error()
      }
      return data.data;
    });
  }


  static async setBuildStart(buildId:string) {
    return SecurityService.axiosInstance.post(`${BuildDTO.baseUrl}/start`, {
      buildId: buildId,
      dateTime: new Date().toISOString(),
    }).then(({data}) => data).catch((e) => {
      console.log(e);
    });
  }

  static async setBuildFinish(buildFinish:BuildFinish) {
    return SecurityService.axiosInstance.post(
        `${BuildDTO.baseUrl}/finish`,
        buildFinish
    ).then(({data}) => data);
  }

  static async setBuildCancel(buildId:string) {
    return SecurityService.axiosInstance.post(`${BuildDTO.baseUrl}/cancel`, {
      buildId: buildId,
    }).then(({data}) => data);
  }
}

export default BuildDTO;
