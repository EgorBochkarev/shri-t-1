class TokenService {
  static async getAccessToken() {
    return process.env.ACCESS_TOKEN;
  }
}

export default TokenService;
