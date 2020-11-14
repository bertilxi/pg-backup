import dayjs from "dayjs";
import { run } from "./utils";

export const dump = async (
  containerQuery: string,
  username: string,
  dbs: string[]
) => {
  const res = await run(
    `docker ps --filter "name=${containerQuery}" --filter status=running --format "{{.Names}}"`
  );
  const container = res.split("\n")[0];
  const files: string[] = [];

  for (const db of dbs) {
    const fileName = `backup-${db}-${dayjs().format("YYYY.MM.DD")}`;
    const args = `-U ${username} ${db}`;

    const sqlPath = `${fileName}.sql`;
    const tarPath = `${fileName}.tar.xz`;
    const dbCmd = `docker exec ${container} pg_dump ${args} > ${sqlPath}`;
    const compressCmd = `tar cfJ ${tarPath} ${sqlPath}`;

    console.log(dbCmd);

    await run(dbCmd);
    await run(compressCmd);

    files.push(`${fileName}.tar.xz`);
  }
  return files;
};
