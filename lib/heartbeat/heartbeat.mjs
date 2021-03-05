import path from "path";

const Liveness = ({ name, version }) => (call, callback) => {
  const data = {
    name,
    version,
    date: new Date().toISOString(),
    status: "alive",
  };

  return callback(null, data);
};

const Sum = () => (call, callback) => {
  const { left, right } = call.request;

  const data = {
    result: left + right,
  };

  return callback(null, data);
};

export const heartbeat = (config) => ({
  protoPath: path.resolve("lib/heartbeat/heartbeat.proto"),
  packageName: "grpc_stub",
  serviceName: "Heartbeat",
  options: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
  routes: {
    Liveness: Liveness(config),
    Sum: Sum(config),
  },
});
