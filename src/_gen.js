const fs = require('fs-extra');
const path = require('path');
const buildtime = require('../buildtime');
const { execSync } = require('child_process');
const colors = require('colors');

module.exports = function gen(options) {
  // 项目配置信息
  const config = require(path.join(process.cwd(), 'pkg.config.json'))
  // 静态资源存放路径
  var staticPath = path.join(path.join(process.cwd(), config.static));

  var timespan = buildtime.getBuildTime();

  // fs.ensureFileSync(staticPath + 'buildtime.txt');
  fs.writeFile(staticPath + 'buildtime.txt', 'v_' + timespan, 'utf-8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      console.log(
        '\n' + 
        '   ' + colors.green(timespan) + '\n'
      )
    }
  });

  if (options.commit === true) {
    execSync("git add -A")
    execSync("git commit -m \"[build] timestamp\"")
  }
}
