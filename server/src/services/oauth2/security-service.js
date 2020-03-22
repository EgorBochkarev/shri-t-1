const TokenService = require('./token-service');
const axios = require('axios');

class SecurityService {
  static start() {
    return TokenService.getAccessToken().then((token) => {
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
