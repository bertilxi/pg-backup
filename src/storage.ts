import api from "dropbox-v2-api";
import fs from "fs";
import path from "path";
import { rootPath } from "./utils";

const { DROPBOX_TOKEN } = process.env;

const callDropbox = api.authenticate({
  token: DROPBOX_TOKEN,
});

const dropbox = (config) =>
  new Promise((resolve, reject) => {
    callDropbox(config, (error, result, response) => {
      if (error) {
        return reject(error);
      }

      resolve({ result, response });
    });
  });

export const upload = (src: string, filename: string) => {
  return dropbox({
    resource: "files/upload",
    parameters: {
      path: `/${filename}`,
    },
    readStream: fs.createReadStream(path.join(rootPath, src, filename)),
  }).catch(console.error.bind(console));
};
