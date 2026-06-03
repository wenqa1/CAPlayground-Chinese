const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('node:path');
const http = require('node:http');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let serverProcess = null;

function startServer() {
  return new Promise((resolve, reject) => {
    const webDir = path.join(__dirname, '..', '..', '..', 'apps', 'web');

    serverProcess = spawn('npx', ['next', 'start', '-p', '3456'], {
      cwd: webDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PORT: '3456' },
    });

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('[Next.js]', output);
      if (output.includes('started server') || output.includes('localhost:3456') || output.includes('ready')) {
        // Give it a moment to stabilize
        setTimeout(() => resolve(), 1000);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.log('[Next.js]', data.toString());
    });

    serverProcess.on('error', reject);

    serverProcess.on('exit', (code) => {
      console.log(`[Next.js] Server exited with code ${code}`);
      serverProcess = null;
    });

    // Fallback: resolve after 15 seconds even if we didn't detect the ready message
    setTimeout(() => resolve(), 15000);

    // Try to connect to the server
    let attempts = 0;
    const tryConnect = () => {
      attempts++;
      http.get('http://localhost:3456', (res) => {
        resolve();
      }).on('error', () => {
        if (attempts < 60) {
          setTimeout(tryConnect, 1000);
        } else {
          reject(new Error('Server failed to start'));
        }
      });
    };
    setTimeout(tryConnect, 2000);
  });
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'CAPlayground',
    icon: path.join(__dirname, '..', '..', '..', 'apps', 'web', 'public', 'icon-light.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('http://localhost:3456');

  // Remove menu bar for cleaner look (optional)
  // mainWindow.setMenuBarVisibility(false);
};

app.whenReady().then(async () => {
  try {
    console.log('Starting Next.js server...');
    await startServer();
    console.log('Server started, creating window...');
    createWindow();
  } catch (err) {
    console.error('Failed to start server:', err);
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});
