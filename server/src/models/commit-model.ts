class CommitModel {
  commitHash: string;
  commitMessage: string;
  branchName?: string;
  authorName: string;
  constructor(commitHash:string, commitMessage:string, authorName:string, branchName?:string) {
    this.commitHash = commitHash;
    this.commitMessage = commitMessage;
    this.branchName = branchName,
    this.authorName = authorName;
  }

  setBranchName(branchName:string) {
    this.branchName = branchName;
  }
}

export default CommitModel;
