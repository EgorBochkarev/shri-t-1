class CommitModel {
  constructor(commitHash, commitMessage, authorName, branchName) {
    this.commitHash = commitHash;
    this.commitMessage = commitMessage;
    this.branchName = branchName,
    this.authorName = authorName;
  }

  setBranchName(branchName) {
    this.branchName = branchName;
  }
}

module.exports = CommitModel;
