const axios = require('axios');

const host = 'http://localhost:3000';

class RestApi {
  static async checkHealth() {
    return axios.get(`${host}/health`);
  }
  static async getConfig() {
    return axios.get(`${host}/api/settings`)
        .then(({data}) => data);
  }
  static async setConfig(settings) {
    return axios.post(`${host}/api/settings`, settings)
        .then(({data}) => data);
  }
  static async deleteConfig() {
    return axios.delete(`${host}/api/settings`);
  }

  static async getBuilds(offset, limit) {
    const queryParams = limit ? `?offset=${offset}&limit=${limit}` : '';
    return axios.get(`${host}/api/builds${queryParams}`)
        .then(({data}) => data);
  }
  static async getBuild(id) {
    return axios.get(`${host}/api/builds/${id}`)
        .then(({data}) => data);
  }
  static async getBuildLog(id) {
    return axios.get(`${host}/api/builds/${id}/logs`)
        .then(({data}) => data);
  }
  static async runBuild(id) {
    return axios.post(`${host}/api/builds/${id}`)
        .then(({data}) => data);
  }
}

module.exports = RestApi;

