const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const ip = require("ip");
const open = require("react-dev-utils/openBrowser");

function exist(path) {
    return fs.existsSync(path);
}

function cd(dir) {
    try {
        process.chdir(dir);
    } catch (err) {
        console.log("chdir: " + err);
    }
}

function spawnCmd(command, options) {
    var file, args;
    if (process.platform === "win32") {
        file = "cmd.exe";
        args = ["/s", "/c", '"' + command + '"'];
        options = util._extend({}, options);
        options.windowsVerbatimArguments = true;
    } else {
        file = "/bin/sh";
        args = ["-c", command];
    }
    var child = spawn(file, args, options);
    // :todo
    child.stdout.on("data", (data) => console.log(data.toString()));
    child.stderr.on("data", (data) => console.log(data.toString()));
    return child;
}

// function currentProjectName() {
//   var rootDir = __dirname
//   return rootDir.split(path.sep).slice(-1)[0]
// }

function tryToFindPackageProjectDir(cb) {
    var dir = __dirname;

    while ("/" !== dir) {
        dir = path.posix.join(dir, "..");

        let packagePath = path.posix.join(dir, "package");
        let packageJsonPath = path.posix.join(packagePath, "package.json");

        if (exist(packagePath) && exist(packageJsonPath)) {
            return cb(null, packagePath);
        }
    }
    cb(Error("can not find package directory"));
}

function tryToFindPort(cb) {
    try {
        var content = fs.readFileSync("bin/www").toString();
        var port = /('|")(\d{4})\1/.exec(content)[2];
        cb(null, port);
    } catch (e) {
        cb(e);
    }
}

const originCwd = process.cwd();
const staticPath = path.join(originCwd, "web/Public/static");
const currentProjectName = originCwd.split(path.sep).slice(-1)[0];

var child1, child2;
function run(options) {
    //
    tryToFindPort((err, port) => {
        if (err) return;
        setTimeout(() => {
            open(`http://${ip.address()}:${port}/`);
        }, 2000);
    });

    // start node server
    child1 = spawnCmd("npm run start");
    if (exist(path.join(staticPath, "webpack.config.js"))) {
        cd(staticPath);
        var package = require(path.join(staticPath, "./package.json"));
        child2 = spawnCmd(package.scripts.dev);
    } else {
        // tryToFindPackageProjectDir((err, packgeDir) => {
        //   if (err) {
        //     throw err
        //   }
        //   cd(packgeDir)
        //   var projectName = currentProjectName()
        //   var projectCmd = projectName.split('_')[1]
        //   spawnCmd("npm run " + projectCmd)
        // })
        cd(__dirname);
        var ownPackage = require(path.join(__dirname, "../package.json"));
        var projectCmd = "dev-" + currentProjectName.split("_")[1];
        child2 = spawnCmd("npm run " + projectCmd);
        cd(originCwd);
    }
}

process.on("SIGINT", () => {
    child1.kill("SIGINT");
    child2.kill("SIGINT");
    process.exit(0);
});

module.exports = run;
