import axios from 'axios';
import CommitModel from '../../models/commit-model';

type GitCommitResponce = {
  commit:GitCommit
  sha:string
}
type GitCommit = {
  message:string
  author:GitAuthor
}
type GitAuthor = {
  name: string
}

type GitBranch = {
  name: string
}

class GitDTO {
  static baseURL = 'https://api.github.com/repos'
  static axiosInstance = axios.create({
    headers: {
      Accept: 'application/vnd.github.cloak-preview'
    },
  });
  static async getCommit(repo:string, commitHash:string) {
    return GitDTO.axiosInstance.get<GitCommitResponce>(`${GitDTO.baseURL}/${repo}/commits/${commitHash}`)
      .then(({data: {sha, commit}}) => {
        return new CommitModel(sha, commit.message, commit.author.name);
      }).catch(({response}) => {
        GitDTO.handleError(response.config.url,response.status,response.data.message,response.data.documentation_url);
        throw Error();
      });
  }

  // since: This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
  static async getCommits(repo:string, since:string) {
    return GitDTO.axiosInstance.get<GitCommitResponce[]>(`${GitDTO.baseURL}/${repo}/commits`, {
      params: {since}
    }).then(({data}) => {
      // eslint-disable-next-line max-len
      return data.map(({sha, commit}) => new CommitModel(sha, commit.message, commit.author.name));
    }).catch(({response}) => {
      GitDTO.handleError(response.config.url,response.status,response.data.message,response.data.documentation_url);
      throw Error();
    });
  }

  static async getCommitBranches(repo:string, commitHash:string) {
    // eslint-disable-next-line max-len
    return GitDTO.axiosInstance.get<GitBranch[]>(`${GitDTO.baseURL}/${repo}/commits/${commitHash}/branches-where-head`, {
      headers: {
        Accept: 'application/vnd.github.groot-preview+json',
      },
    }).then(({data}) => {
      return data.map((branch) => branch.name);
    }).catch(({response}) => {
      GitDTO.handleError(response.config.url,response.status,response.data.message,response.data.documentation_url);
      throw Error();
    });
  }

  static handleError(url:string, status:string, message:string, documentationUrl:string){
    console.error(
        `Request ${url} was failed`,
        `with status ${status} and message:`,
        message,
        `Documentation: ${documentationUrl}`
    );
  }
}

export default GitDTO;
