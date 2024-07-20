const shelljs = require('shelljs')

module.exports = {
  branch: (branch, { all, startPoint }) => {
    var cmd = 'git branch --no-color -vv'
    if (branch) {
      cmd += ` ${branch} ${startPoint}`
    }
    if (all) {
      cmd += ' -a'
    }
    const { code, stdout } = shelljs.exec(cmd, { silent: true })
    if (code !== 0) {
      return ''
    } else {
      return stdout
    }
  },
  containBranch: (branch, { remote }) => {
    var cmd = `git branch --contains ${branch} -vv`
    if (remote) {
      cmd += ' -r'
    }
    const { code, stdout } = shelljs.exec(cmd, { silent: true })
    if (code !== 0) {
      return ''
    } else {
      return stdout
    }
  },
  noContainBranch: (branch, { remote }) => {
    var cmd = `git branch --no-contains ${branch} -vv`
    if (remote) {
      cmd += ' -r'
    }
    const { code, stdout } = shelljs.exec(cmd, { silent: true })
    if (code !== 0) {
      return ''
    } else {
      return stdout
    }
  },
  lastCommitTime: (branch) => {
    const { code, stdout } = shelljs.exec(`git log ${branch} -1 --date=short --pretty=format:%cd`, { silent: true })
    if (code !== 0) {
      return null
    } else {
      return stdout
    }
  },
  removeBranch: (branch) => {
    const { code, stdout } = shelljs.exec(`git branch -D ${branch}`)
    if (code !== 0) {
      return false
    } else {
      return true
    }
  }
}