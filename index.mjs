import Services from "../services/services.definition.mjs";
import { start } from "./lib/stub-server.mjs";

if (!Array.isArray(Services)) {
  console.error(`
"/services/services.definition.mjs" must export a list of service definitions.
You can learn more at <https://github.com/hitmands/grpc-stub#folder-structure>
`);

  process.exit(1);
}

(async () => {
  try {
    await start(Services);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
