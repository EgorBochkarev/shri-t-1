const TokenService = require('./token-service');
const axios = require('axios');

class SecurityService {
  static start() {
    return TokenService.getAccessToken().then((token) => {
      if (!token) {
        throw new Error('Not valid access token, please set it in .env file');
      }
      SecurityService.axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return SecurityService.axiosInstance;
    });
  }
}

module.exports = SecurityService;
