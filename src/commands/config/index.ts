import {
  ensureFileSync,
  existsSync,
  readFileSync,
  readJSON,
  writeFileSync,
} from "fs-extra";
import get from "lodash.get";
import set from "lodash.set";
import { homedir } from "os";
import { join, resolve } from "path";

const dir = join(homedir(), ".daily");
const filepath = resolve(dir, "config.json");

const configure = async (value: any, options: any) => {
  initConfig();
  const config = await readJSON(filepath);

  if ("get" in options) {
    const result = get(config, options.get);

    console.log(JSON.stringify(result));
  }

  if ("set" in options) {
    set(config, options.set, value);

    writeFileSync(filepath, JSON.stringify(config, null, 2));
  }

  if ("output" in options) {
    console.log(JSON.stringify(config, null, 2));
  }
};

const initConfig = () => {
  if (existsSync(filepath)) {
    return;
  }

  ensureFileSync(filepath);

  writeFileSync(filepath, readFileSync(resolve(__dirname, "./config.json")));
};

const run = async (value: any, options: any) => {
  return configure(value, options);
};

export default run;
