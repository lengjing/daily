var buildtime = require('./buildtime');
var fs = require('fs-extra');

var program = require('commander');
var fs = require('fs-extra');
var colors = require('colors');
var sync = require('./sync');

program
    .version('0.0.1')
    .option('--env <env>', 'package enviroment')
    .option('--path <path>', 'project path')
    .option('--channel <channel>', 'package channel')
    .option('--inline')
    .option('--content-base')
    .option('--host')
    .option('--port')
    .option('--progress')
    .parse(process.argv);

//项目配置信息
var pkg =JSON.parse(fs.readFileSync(program.path + "pkg.config.json", "utf-8"));

//PHP项目发布配置文件存放路径
var buildConfigPath = program.path + pkg.config;
//静态资源存放路径
var staticPath = program.path + pkg.static;

var timespan = buildtime.getBuildTime();

fs.ensureFileSync(staticPath + 'buildtime.txt');
fs.writeFileSync(staticPath + 'buildtime.txt', 'v_' + timespan, 'utf-8');

console.log('------------------timespan------------------------'.gray)
console.log('timespan: '.green + timespan);