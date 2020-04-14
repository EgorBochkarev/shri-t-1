const axios = require('axios');

class RestApi {
  static async checkHealth() {
    return axios.get('http://localhost:3000/health');
  }
  static async getConfig() {
    return axios.get('http://localhost:3000/api/settings')
        .then(({data}) => data);
  }
  static async setConfig(settings) {
    return axios.post('http://localhost:3000/api/settings', settings)
        .then(({data}) => data);
  }
  static async deleteConfig() {
    return axios.delete('http://localhost:3000/api/settings');
  }
}

module.exports = RestApi;

