import { spawn } from "node:child_process";

export function localBinary(name) {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

export function run(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      env: {
        ...process.env,
        ASTRO_TELEMETRY_DISABLED: "1",
        ...(options.env ?? {})
      },
      stdio: options.stdio ?? "inherit",
      shell: process.platform === "win32" && command.endsWith(".cmd")
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`${command} terminated by ${signal}`));
        return;
      }
      if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}
