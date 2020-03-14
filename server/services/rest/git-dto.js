const axios = require('axios');
const CommitModel = require('../../models/commit-model');

class GitDTO {
    static async getCommit(repo, commitHash) {
        return axios.default.get(`https://api.github.com/repos/${repo}/commits/${commitHash}`, { headers: { 'Accept': "application/vnd.github.cloak-preview" } }).then(({ data }) => {
            const {sha, commit} = data;
            return new CommitModel(sha, commit.message, commit.author.name);
        }).catch((error) => {
            console.log(error);
        });
    }
}

module.exports = GitDTO;