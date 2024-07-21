import Jenkins from "jenkins";

// https://www.npmjs.com/package/jenkins#job-list
const jenkins = new Jenkins({
  baseUrl: "http://user:pass@localhost:8080",
});

type Job = {
  color: "blue";
  name: "example";
  url: "http://localhost:8080/job/example/";
};

class Cache {
  jobs?: Job[] = undefined;
}

// await jenkins.info();

const build = async () => {
  await jenkins.job.build({
    name: "example",
    parameters: { name: "value" },
  });
};

const stop = async () => {
  await jenkins.build.stop("example", 1);
};

const run = async () => {};

export default run;
