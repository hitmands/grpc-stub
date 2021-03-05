import R from "ramda";
import kit from "grpc-kit";
import path from "path";
import fs from "fs";
import { heartbeat } from "./heartbeat/heartbeat.mjs";
import { validate } from "./with-defaults.mjs";

export const start = async (Services = []) => {
  const server = kit.createServer();

  const { name, version } = JSON.parse(
    fs.readFileSync(path.resolve("./package.json"), "utf8")
  );

  const services = await validate([heartbeat].concat(Services), {
    name,
    version,
  });

  const tasks = R.map((service) => server.use(service), services);

  await Promise.all(tasks);
  await server.listen("0.0.0.0:3333");

  console.log({
    name,
    version,
    message: "Stub Server Listening",
    severity: "INFO",
    services: services.map(
      (service) => `${service.packageName}/${service.serviceName}`
    ),
  });
  return server;
};
