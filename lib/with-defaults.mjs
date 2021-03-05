import fs from "fs";
import R from "ramda";

const invalid = R.either(R.isNil, R.isEmpty);

const withOptions = R.applySpec({
  keepCase: R.propOr(true, "keepCase"),
  defaults: R.propOr(true, "defaults"),
  oneofs: R.propOr(true, "oneofs"),
  longs: R.propOr(String, "longs"),
  enums: R.propOr(String, "enums"),
});

const error = (svc, message) => {
  throw new TypeError(`Service('${svc}').ConfigurationError: ${message}`);
};

const assertRoutes = (packageName, routes) =>
  R.pipe(
    R.toPairs,
    R.forEach(([name, fn]) => {
      if (typeof fn !== "function") {
        error(packageName, `route "${name}" must be a function`);
      }
    })
  )(routes);

const withDefaults = async (config = {}) => {
  const { packageName, serviceName, protoPath, routes, options = {} } = config;

  if (invalid(packageName)) {
    error("unknown", 'the field "packageName" is invalid');
  }

  if (invalid(serviceName)) {
    error(packageName, `the field "serviceName" is invalid`);
  }

  const svc = `${packageName}/${serviceName}`;

  if (invalid(protoPath)) {
    error(svc, `the field "protoPath" is invalid`);
  }

  if (!fs.existsSync(protoPath)) {
    error(svc, `Cannot read protofile "${protoPath}"`);
  }

  if (invalid(routes)) {
    error(svc, `the field "routes" cannot be empty`);
  }

  assertRoutes(svc, routes);

  return {
    packageName,
    serviceName,
    protoPath,
    routes,
    options: withOptions(options),
  };
};

export const validate = async (factories, config) => {
  if (!factories.length) {
    return [];
  }

  const [head, ...tail] = factories;

  const service = await withDefaults(await head(config));

  return [service].concat(await validate(tail, config));
};
