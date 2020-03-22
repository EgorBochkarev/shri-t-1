const SecurityService = require('../oauth2/security-service');

class ConfDTO {
  static async getConf() {
    return SecurityService.axiosInstance.get(this.url)
        .then(({data}) => data.data || {});
  }

  // {
  //     "repoName": "string",
  //     "buildCommand": "string",
  //     "mainBranch": "string",
  //     "period": 0
  // }
  static async setConf(conf) {
    return SecurityService.axiosInstance.post(this.url, conf);
  }

  static async deleteConf() {
    return SecurityService.axiosInstance.delete(this.url);
  }
}
ConfDTO.url = 'https://hw.shri.yandex/api/conf';

module.exports = ConfDTO;
