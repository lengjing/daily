import * as commander from "commander";
import colors from "colors";
import updater from "update-notifier";
// import packageJson from '../package.json' with {type: 'json'};

const { default: packageJson } = await import("../package.json", {
  assert: {
    type: "json",
  },
});

const program = new commander.Command(packageJson.name);

program.version(packageJson.version).usage("<command> [options]");

program
  .command("dev")
  .description("start a dev server for development")
  .action(function (cmd) {
    require("./dev")({});
  })
  .option(
    "--verbose",
    `print additional logs ${colors.yellow("(not support)")}`
  )
  .option(
    "--info",
    `print environment debug info ${colors.yellow("(not support)")}`
  )
  .on("--help", () => {
    console.log(`    Only be effective in the project directory.`);
    console.log(`    `);
    console.log(`    For example:`);
    console.log(`    `);
    console.log(`    ${colors.red("$")} cd ~/code/Mboss_xiaoyi`);
    console.log(`    ${colors.red("$")} package dev`);
    console.log();
  });

program
  .command("config")
  .description("configure daily options")
  .action(function (cmd, options) {
    require("./commands/config")(options);
  })
  .on("--help", () => {
    console.log(`
     Get and set config.
     
     For example:
     ${colors.red("$")} daily config set jenkins.username 'xxx'
     ${colors.red("$")} daily config set jenkins.password 'xxx'

`);
  });

program
  .command("gen")
  .description("生成静态资源时间戳")
  .action(function (cmd) {
    require("./_gen")(cleanArgs(cmd));
  })
  .option("-c, --commit", `自动提交`)
  .on("--help", () => {
    console.log(`    例如:`);
    console.log(`    `);
    console.log(`    ${colors.red("$")} cd ~/code/Mboss_xiaoyi`);
    console.log(`    ${colors.red("$")} package gen -c`);
    console.log();
  });

program
  .command("daily")
  .description("日常分支管理" + "\n")
  .action(function (cmd) {
    require("./daily")(cleanArgs(cmd));
  })
  .option(
    "-c, --clean",
    `清除远程无效分支（30天内未被合并至 master 的分支都视为无效分支）`
  )
  .option("-l, --list", `显示所有 daily 分支的合并状态`)
  .option("--mr", `提交 merge request 请求 ${colors.yellow("(not support)")}`)
  .on("--help", () => {
    console.log(`  说明:`);
    console.log(`    `);
    console.log(
      `    1. 开发分支命名没有明确要求，建议使用自己名字首字母做开头比如：sty/dev`
    );
    console.log(
      `    2. 使用统一的测试分支，每套测试环境分别用不同的分支名例如：线下测试环境 develop，uat环境 uat `
    );
    console.log(`    3. 上线分支由工具生成格式为 daily/x.x.x 不需要自己新建`);
    console.log(`    4. 上线后请及时发合并请求，以保证 master 分支的稳定性`);
    console.log();
    console.log(
      `    后期规划接入 auto 自动发布，简单的 lint 检验以及里程碑等`.gray
    );
    console.log(`    `);
  });

program.parse(process.argv);

updater({ pkg: packageJson, updateCheckInterval: 0 }).notify();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli/bin/vue.js#L191
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = o.long.replace(/^--/, "");
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });
  return args;
}
