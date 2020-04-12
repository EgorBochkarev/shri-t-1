const SecurityService = require('../oauth2/security-service');
const NodeCache = require( 'node-cache' );

class BuildDTO extends SecurityService {
  static async getBuildList(offset, limit) {
    const myURL = new URL(`${BuildDTO.baseUrl}/list`);
    // Add some validation
    offset && myURL.searchParams.append('offset', offset);
    limit && myURL.searchParams.append('limit', limit);
    return SecurityService.axiosInstance.get(myURL.toString())
        .then(({data}) => data);
  }
  static async getBuildLog(buildId) {
    if (BuildDTO.logCache.has(buildId)) {
      return BuildDTO.logCache.get(buildId);
    }
    const myURL = new URL(`${BuildDTO.baseUrl}/log`);
    // Add some validation
    buildId && myURL.searchParams.append('buildId', buildId);
    return SecurityService.axiosInstance.get(myURL.toString())
        .then(({data}) => {
          try {
            BuildDTO.logCache.set(buildId, data);
          } catch (e) {
            console.log('Cashe limit was succed');
          }
          return data;
        });
  }
  static async getBuildDetails(buildId) {
    const myURL = new URL(`${BuildDTO.baseUrl}/details`);
    // Add some validation
    buildId && myURL.searchParams.append('buildId', buildId);
    return SecurityService.axiosInstance.get(myURL.toString())
        .then(({data}) => data && data.data);
  }
  // {
  //     "commitMessage": "string",
  //     "commitHash": "string",
  //     "branchName": "string",
  //     "authorName": "string"
  // }
  static async setBuildRequest(request) {
    return SecurityService.axiosInstance.post(
        `${BuildDTO.baseUrl}/request`,
        request
    ).then(({data}) => data && data.data);
  }


  static async setBuildStart(buildId) {
    return SecurityService.axiosInstance.post(`${BuildDTO.baseUrl}/start`, {
      buildId: buildId,
      dateTime: new Date().toISOString(),
    }).then(({data}) => data).catch((e) => {
      console.log(e);
    });
  }
  // {
  //     "buildId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //     "duration": 0,
  //     "success": true,
  //     "buildLog": "string"
  // }
  static async setBuildFinish(request) {
    return SecurityService.axiosInstance.post(
        `${BuildDTO.baseUrl}/finish`,
        request
    ).then(({data}) => data);
  }
  static async setBuildCancel(buildId) {
    return SecurityService.axiosInstance.post(`${BuildDTO.baseUrl}/cancel`, {
      buildId: buildId,
    }).then(({data}) => data);
  }
}
BuildDTO.logCache = new NodeCache({
  stdTTL: 3600,
  maxKeys: 200,
});
BuildDTO.baseUrl = 'https://hw.shri.yandex/api/build';
module.exports = BuildDTO;
