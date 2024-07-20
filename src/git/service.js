const Git = require('./git')

const branchWithTrackingRegex = /^(\*?)\s+(.+?)\s+([0-9,a-f]+)\s+(?:\[(.*?\/.*?)(?:\:\s(.*)\]|\]))?/gm;
// const branchWithTrackingStateRegex = /^(?:ahead\s([0-9]+))?[,\s]*(?:behind\s([0-9]+))?/;
function parseBranch(data) {
  const branches = [];
  let match = null;
  do {
    match = branchWithTrackingRegex.exec(data);
    if (match == null) break;

    branches.push(match[2]);
  } while (match != null);

  if (!branches.length) return undefined;

  return branches;
}
class GitService {
  constructor() {

  }
  newBranch(branch) {
    var data = Git.branch(branch, { startPoint: 'origin/master' })
    return data ? true : false
  }
  getBranches() {
    var data = Git.branch(null, { all: true })
    if (data) {
      return parseBranch(data)
    } else {
      return []
    }
  }
  getContainBranch(branch) {
    var data = Git.containBranch(branch, { remote: true })
    if (data) {
      return parseBranch(data)
    } else {
      return []
    }
  }
  getNoContainBranch(branch) {
    var data = Git.noContainBranch(branch, { remote: true })
    if (data) {
      return parseBranch(data)
    } else {
      return []
    }
  }
  getLastCommitTime(branch) {
    var data = Git.lastCommitTime(branch)
    if (data) {
      return data
    } else {
      return null
    }
  }
  removeBranch(branch){
    Git.removeBranch(branch)
  }
}

module.exports = GitService
