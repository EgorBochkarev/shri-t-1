import TokenService from './token-service';
import axios, { AxiosInstance } from 'axios';

class SecurityService {
  static axiosInstance: AxiosInstance;
  static async start() {
    const token = await TokenService.getAccessToken();
    if (!token) {
      throw new Error('Not valid access token, please set it in .env file');
    }
    SecurityService.axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return SecurityService.axiosInstance;
  }
}

export default SecurityService;
