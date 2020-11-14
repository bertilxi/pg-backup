import { findContainer, run } from "./utils";

export const restore = async ({
  filename = "",
  db = "postgres",
  user = "postgres",
  extract = false,
  containerName = "",
}) => {
  if (extract) {
    await run(`tar -xf ${filename}.tar.xz ${filename}.sql`);
  }

  if (containerName) {
    const container = await findContainer(containerName);

    return await run(
      `cat ${filename}.sql | docker exec -i ${container} psql --set ON_ERROR_STOP=on -U ${user} ${db}`
    );
  }

  await run(`cat ${filename}.sql | psql -U ${user} ${db}`);
};

/*

restore({
  user: "postgres",
  filename: "backup",
  db: "thepizzaclub",
  containerName: "db",
}).catch(console.error.bind(console));

*/
