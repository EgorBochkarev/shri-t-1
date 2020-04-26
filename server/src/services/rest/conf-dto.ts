import SecurityService from '../oauth2/security-service';

export type Data<T> = {
  data?: T
}

export type Configuration = {
  id: string
  repoName:string
  buildCommand:string
  mainBranch:string
  period:number
}

class ConfDTO {
  static baseUrl = 'https://hw.shri.yandex/api/conf'
  static getConf() {
    return SecurityService.axiosInstance.get<Data<Configuration>>(this.baseUrl)
        .then(({data}) => data.data);
  }

  static async setConf(conf:Configuration) {
    return SecurityService.axiosInstance.post<undefined>(this.baseUrl, conf)
      .then(({data}) => data);
  }

  static async deleteConf() {
    return SecurityService.axiosInstance.delete(this.baseUrl)
      .then(({data}) => data);
  }
}

export default ConfDTO;
