import cp from "child_process";
import path from "path";
import { promisify } from "util";

export const rootPath = path.resolve(process.cwd());

export const exec = promisify(cp.exec);

export const run = async (cmd: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { stdout, stderr } = await exec(cmd);

      if (stderr) {
        return reject(stderr);
      }

      resolve(stdout);
    } catch (error) {
      reject(error);
    }
  });
};

export const findContainer = async (name: string) => {
  const res = await run(
    `docker ps --filter "name=${name}" --filter status=running --format "{{.Names}}"`
  );
  return res.split("\n")[0];
};
