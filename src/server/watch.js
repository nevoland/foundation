import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { readdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";

const SERVER_DIRECTORY = resolve(process.cwd(), "src/server");
const SERVER_ENTRYPOINT = resolve(SERVER_DIRECTORY, "main.ts");
const WATCHED_EXTENSIONS = new Set([".js", ".ts"]);
const WATCH_DEBOUNCE_MS = 100;
const FORCE_KILL_AFTER_MS = 2_000;

const watchedDirectories = new Map();
let childProcess;
let restartTimer;
let isRestarting = false;
let forceKillTimer;

async function listDirectories(directory) {
  const directories = [directory];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    directories.push(...(await listDirectories(resolve(directory, entry.name))));
  }

  return directories;
}

async function refreshDirectoryWatchers() {
  const directories = new Set(await listDirectories(SERVER_DIRECTORY));

  for (const [directory, watcher] of watchedDirectories) {
    if (directories.has(directory)) {
      continue;
    }

    watcher.close();
    watchedDirectories.delete(directory);
  }

  for (const directory of directories) {
    if (watchedDirectories.has(directory)) {
      continue;
    }

    const watcher = watch(directory, (eventType, fileName) => {
      if (!fileName) {
        return;
      }

      const filePath = resolve(directory, fileName.toString());
      const extension = extname(filePath);

      if (eventType === "rename" && dirname(filePath) === directory) {
        void refreshDirectoryWatchers();
      }

      if (!WATCHED_EXTENSIONS.has(extension)) {
        return;
      }

      scheduleRestart();
    });

    watchedDirectories.set(directory, watcher);
  }
}

function spawnServer() {
  childProcess = spawn(
    process.execPath,
    [
      "--env-file=.env",
      "--env-file-if-exists=.env.local",
      "--experimental-strip-types",
      "--disable-warning=ExperimentalWarning",
      SERVER_ENTRYPOINT,
    ],
    { stdio: "inherit" },
  );

  childProcess.once("exit", () => {
    if (!isRestarting) {
      childProcess = undefined;
    }
  });
}

function killServer() {
  if (!childProcess || childProcess.killed) {
    return;
  }

  childProcess.kill("SIGTERM");
  forceKillTimer = setTimeout(() => {
    if (childProcess && !childProcess.killed) {
      childProcess.kill("SIGKILL");
    }
  }, FORCE_KILL_AFTER_MS);
}

function scheduleRestart() {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    if (!childProcess) {
      spawnServer();
      return;
    }

    isRestarting = true;
    childProcess.once("exit", () => {
      clearTimeout(forceKillTimer);
      isRestarting = false;
      spawnServer();
    });
    killServer();
  }, WATCH_DEBOUNCE_MS);
}

function shutdown() {
  clearTimeout(restartTimer);
  clearTimeout(forceKillTimer);

  for (const watcher of watchedDirectories.values()) {
    watcher.close();
  }

  watchedDirectories.clear();
  killServer();
  process.exit(0);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, shutdown);
}

await refreshDirectoryWatchers();
spawnServer();