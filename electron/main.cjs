const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let nextProcess;
let mainWindow;

const PORT = 31415;
const projectRoot = path.join(__dirname, "..");

function startNextServer() {
  const nextBin = path.join(
    projectRoot,
    "node_modules",
    "next",
    "dist",
    "bin",
    "next"
  );

  nextProcess = spawn("node", [nextBin, "start", "-p", String(PORT)], {
    cwd: projectRoot,
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
    stdio: "inherit",
  });

  nextProcess.on("error", (error) => {
    console.error("Failed to start Next.js:", error);
  });

  nextProcess.on("exit", (code) => {
    console.log(`Next.js exited with code ${code}`);

    if (!app.isQuitting) {
      app.quit();
    }
  });
}

async function waitForNext() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(`http://localhost:${PORT}`);

      if (response.ok) {
        return;
      }
    } catch {
      // Next.js isn't ready yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Next.js server did not start in time.");
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: "#050506",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await waitForNext();

  await mainWindow.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(async () => {
  try {
    startNextServer();
    await createWindow();
  } catch (error) {
    console.error(error);
    app.quit();
  }
});

app.on("before-quit", () => {
  app.isQuitting = true;

  if (nextProcess) {
    nextProcess.kill();
    nextProcess = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});