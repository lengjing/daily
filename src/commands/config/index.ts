import { ensureFileSync, readFileSync, writeFileSync } from "fs-extra";
import get from "lodash.get";
import set from "lodash.set";
import { homedir } from "os";
import { join, resolve } from "path";

export const setConfig = (name: string) => { };

export const getConfig = (name?: string) => {
    return;
};

export const initConfig = () => {
    const dir = join(homedir(), ".daily");
    const filepath = resolve(dir, "config.json");

    ensureFileSync(filepath);

    writeFileSync(filepath, readFileSync("./config.json"));
};

const run = (options)=>{
    
}

export default run