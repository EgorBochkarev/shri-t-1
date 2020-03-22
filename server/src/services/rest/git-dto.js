const axios = require('axios');
const CommitModel = require('../../models/commit-model');

class GitDTO {
  static async getCommit(repo, commitHash) {
    // eslint-disable-next-line max-len
    return GitDTO.axiosInstance.get(`${GitDTO.baseURL}/${repo}/commits/${commitHash}`).then(({data}) => {
      const {sha, commit} = data;
      return new CommitModel(sha, commit.message, commit.author.name);
    }).catch((error) => {
      console.log(error);
    });
  }

  // since: This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
  static async getCommits(repo, since) {
    const myURL = new URL(`${GitDTO.baseURL}/${repo}/commits`);
    // Add some validation
    since && myURL.searchParams.append('since', since);
    return GitDTO.axiosInstance.get(myURL.toString()).then(({data}) => {
      // eslint-disable-next-line max-len
      return data.map(({sha, commit}) => new CommitModel(sha, commit.message, commit.author.name));
    }).catch((error) => {
      console.log(error);
    });
  }

  static async getCommitBranches(repo, commitHash) {
    // eslint-disable-next-line max-len
    return GitDTO.axiosInstance.get(`${GitDTO.baseURL}/${repo}/commits/${commitHash}/branches-where-head`, {
      headers: {
        Accept: 'application/vnd.github.groot-preview+json',
      },
    }).then(({data}) => {
      return data.map((branch) => branch.name);
    }).catch((error) => {
      console.log(error);
    });
  }
}
GitDTO.baseURL = 'https://api.github.com/repos',
GitDTO.axiosInstance = axios.create({
  headers: {
    Accept: 'application/vnd.github.cloak-preview',
  },
});

module.exports = GitDTO;
