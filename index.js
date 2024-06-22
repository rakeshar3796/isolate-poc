const { execSync } = require("node:child_process");
const { execPath } = require("node:process");

// execSync("./isolate --cleanup", { stdio: "inherit" });
execSync("./isolate --init --box-id=1", { stdio: "inherit" });
execSync(`./isolate --run --box-id=1 ${execPath} ./script.js`, {
  stdio: "inherit",
});
