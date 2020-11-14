import cron from "node-cron";
import { dump } from "./db";
import { upload } from "./storage";
import { run } from "./utils";

const { CONTAINER = "", USERNAME = "", CRON = "0 6 * * *" } = process.env;
const DBS = JSON.parse(process.env.DBS ?? "[]");

const makeBackup = async () => {
  try {
    const files = await dump(CONTAINER, USERNAME, DBS);

    for (const file of files) {
      await upload(".", file);
      console.log(`${file} uploaded`);
    }

    await run("rm -rf ./backup*");
  } catch (error) {
    console.error(error);
  }
};

export const start = () => {
  makeBackup();
  cron.schedule(CRON, makeBackup);
};
