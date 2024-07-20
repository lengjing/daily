const shelljs = require('shelljs')
const colors = require('colors')
const inquirer = require('inquirer')
const GitService = require('./git/service')

const gitService = new GitService()
const ONE_MONTH = 30 * 24 * 60 * 60 * 1000
module.exports = function (options) {
  // fetch objects
  // shelljs.exec('git fetch -p', { silent: true })

  if (Object.keys(options).length === 0) {
    let dailyBranch = 'daily/' + version()
    let branches = gitService.getBranches()

    console.log('')
    console.log('  今天上线的 daily 分支为：' + dailyBranch.green)
    console.log('')

    if (!branches.includes(dailyBranch)) {
      let question = {
        type: 'confirm',
        name: 'needCreateBranch',
        message:
          colors.yellow("系统未发现该分支，是否需要新建 ") +
          `${colors.bold(dailyBranch)} ?`,
        default: true,
      };
      inquirer
        .prompt(question)
        .then(answer => {
          if (answer.needCreateBranch) {
            gitService.newBranch(dailyBranch)
          }
        })
    }
  }

  if (options.clean) {
    let now = Date.now()
    let question = {
      type: 'checkbox',
      message: '请选择需要删除的分支',
      name: 'needRemoveBranches',
      choices: []
    }
    gitService.getNoContainBranch('master')
      .map(branch => {
        return {
          raw: branch,
          lastCommitTime: gitService.getLastCommitTime(branch)
        }
      })
      .filter(branch => now - new Date(branch.lastCommitTime) > ONE_MONTH)
      .forEach(branch => {
        question.choices.push({
          name: `${colors.yellow(branch.raw)}  ${colors.gray('[' + branch.lastCommitTime + ']')}`,
          value: branch.raw
        })
      })
    inquirer
      .prompt(question)
      .then(answer => {
        if (answer.needRemoveBranches) {
          answer.needRemoveBranches.forEach(branch => gitService.removeBranch(branch))
        }
      })
  }

  if (options.list) {
    let dailyBranches = gitService.getBranches()
      // .filter(v => /remotes\/origin\//.test(v))
      .filter(v => /daily\/\d+\.\d+\.\d+/.test(v))

    let containedBranches = gitService.getContainBranch('master')

    let msg = dailyBranches.map(dailyBranch => {
      return {
        name: getBranchName(dailyBranch),
        contain: containedBranches.includes(dailyBranch),
        raw: dailyBranch,
      }
    }).reduce((a, v) => {
      return a += `${v.raw}  (${v.contain ? colors.green('已合并') : colors.red('未合并')}) \n`
    }, '\n')

    console.log(msg)
  }
}

function getBranchName(branch) {
  return branch.replace(/remotes\/origin\//, '')
}

// Y => major M => minor D => patch
// 2018 的 major 为 1 
// 2018/10/09 => 1.10.9 
function version() {
  var date = new Date()
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  return `${y - 2017}.${m}.${d}`
}
