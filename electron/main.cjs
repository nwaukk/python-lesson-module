/**
 * Python Visual Lab — Electron Main Process
 * Serves local bundle via custom app:// protocol with COOP/COEP headers for
 * SharedArrayBuffer support, enforces strict security boundaries, manages
 * responsive multi-monitor window state, and provides native .py dialogs & menus.
 */
'use strict';

const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  ipcMain,
  net,
  protocol,
  screen,
  session,
  shell,
} = require('electron');
const { execFile, spawn } = require('node:child_process');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const APP_TITLE = 'Python Visual Lab';
const APP_PROTOCOL_SCHEME = 'app';
const APP_PROTOCOL_HOST = 'bundle';
const APP_ORIGIN = `${APP_PROTOCOL_SCHEME}://${APP_PROTOCOL_HOST}`;
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const PRELOAD_PATH = path.join(__dirname, 'preload.cjs');
const MAX_PYTHON_FILE_BYTES = 5 * 1024 * 1024; // 5 MB safety limit for .py scripts

const DEV_SERVER_URL = process.env.ELECTRON_START_URL || '';
const IS_DEV = !app.isPackaged && Boolean(DEV_SERVER_URL);

// Must register custom scheme privileges before app ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_PROTOCOL_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
      allowServiceWorkers: true,
    },
  },
]);

// Enforce Single Instance Lock
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
  process.exit(0);
}

/** @type {BrowserWindow | null} */
let mainWindow = null;
let pendingOpenFilePath = extractPythonArgPath(process.argv.slice(1));

function extractPythonArgPath(argv) {
  if (!Array.isArray(argv)) return null;
  for (const arg of argv) {
    if (
      typeof arg === 'string' &&
      !arg.startsWith('-') &&
      arg.toLowerCase().endsWith('.py') &&
      fs.existsSync(arg)
    ) {
      return path.resolve(arg);
    }
  }
  return null;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
    case '.mjs':
    case '.cjs':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.wasm':
      return 'application/wasm';
    case '.zip':
      return 'application/zip';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.ico':
      return 'image/x-icon';
    case '.woff':
      return 'font/woff';
    case '.woff2':
      return 'font/woff2';
    case '.ttf':
      return 'font/ttf';
    case '.txt':
    case '.py':
      return 'text/plain; charset=utf-8';
    default:
      return 'application/octet-stream';
  }
}

function buildContentSecurityPolicy(isDevMode) {
  const devOrigin = isDevMode && DEV_SERVER_URL ? new URL(DEV_SERVER_URL).origin : '';
  const devWsOrigin = isDevMode && DEV_SERVER_URL ? `ws://${new URL(DEV_SERVER_URL).host}` : '';
  const selfSources = isDevMode
    ? `'self' ${APP_ORIGIN} ${devOrigin}`
    : `'self' ${APP_ORIGIN}`;

  return [
    `default-src ${selfSources}`,
    `script-src ${selfSources} 'wasm-unsafe-eval'`,
    `style-src ${selfSources} 'unsafe-inline'`,
    `font-src ${selfSources} data:`,
    `img-src ${selfSources} data: blob:`,
    `worker-src ${selfSources} blob:`,
    `connect-src ${selfSources} ${devWsOrigin} data: blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ');
}

function buildIsolationHeaders(isHtml, isDevMode) {
  const headers = {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'X-Content-Type-Options': 'nosniff',
  };
  if (isHtml) {
    headers['Content-Security-Policy'] = buildContentSecurityPolicy(isDevMode);
  }
  return headers;
}

function isSafeExternalHttpUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return false;
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function isTrustedInternalUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return false;
  if (rawUrl.startsWith(`${APP_ORIGIN}/`) || rawUrl === APP_ORIGIN) return true;
  if (IS_DEV && DEV_SERVER_URL) {
    try {
      const target = new URL(rawUrl);
      const dev = new URL(DEV_SERVER_URL);
      return target.origin === dev.origin;
    } catch {
      return false;
    }
  }
  return false;
}

function getWindowStatePath() {
  return path.join(app.getPath('userData'), 'window-state.json');
}

function clampWindowBoundsToVisibleDisplay(state) {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();
  const defaultWorkArea = primary?.workArea || { x: 0, y: 0, width: 1280, height: 760 };

  const targetDisplay =
    (typeof state?.x === 'number' && typeof state?.y === 'number'
      ? screen.getDisplayNearestPoint({ x: state.x + 60, y: state.y + 60 })
      : null) ||
    displays[0] ||
    primary;

  const workArea = targetDisplay?.workArea || defaultWorkArea;

  const minWidth = Math.min(840, workArea.width);
  const minHeight = Math.min(580, workArea.height);

  // First launch fills ~94% of available display cleanly from 14" laptops to 34" ultrawides
  const defaultWidth = Math.max(minWidth, Math.round(workArea.width * 0.94));
  const defaultHeight = Math.max(minHeight, Math.round(workArea.height * 0.94));

  let width = typeof state?.width === 'number' && state.width >= minWidth ? state.width : defaultWidth;
  let height = typeof state?.height === 'number' && state.height >= minHeight ? state.height : defaultHeight;

  width = Math.min(width, workArea.width);
  height = Math.min(height, workArea.height);

  let x =
    typeof state?.x === 'number'
      ? state.x
      : workArea.x + Math.round((workArea.width - width) / 2);
  let y =
    typeof state?.y === 'number'
      ? state.y
      : workArea.y + Math.round((workArea.height - height) / 2);

  // Ensure window stays reachable inside display bounds even after monitor changes
  x = Math.max(workArea.x, Math.min(x, workArea.x + workArea.width - Math.min(width, 280)));
  y = Math.max(workArea.y, Math.min(y, workArea.y + workArea.height - Math.min(height, 180)));

  return {
    x,
    y,
    width,
    height,
    isMaximized: Boolean(state?.isMaximized),
    isFullScreen: Boolean(state?.isFullScreen),
  };
}

function loadWindowState() {
  try {
    const raw = fs.readFileSync(getWindowStatePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return clampWindowBoundsToVisibleDisplay(parsed);
  } catch {
    // Default on first launch: cleanly fill screen work area and start maximized
    const clamped = clampWindowBoundsToVisibleDisplay({});
    return { ...clamped, isMaximized: true, isFullScreen: false };
  }
}

function saveWindowState(win) {
  if (!win || win.isDestroyed()) return;
  try {
    const normalBounds = win.isMaximized() || win.isFullScreen() ? win.getNormalBounds() : win.getBounds();
    const payload = {
      x: normalBounds.x,
      y: normalBounds.y,
      width: normalBounds.width,
      height: normalBounds.height,
      isMaximized: win.isMaximized(),
      isFullScreen: win.isFullScreen(),
    };
    fs.writeFileSync(getWindowStatePath(), JSON.stringify(payload, null, 2), 'utf8');
  } catch (err) {
    console.warn('Unable to persist window state:', err);
  }
}

function resolveAppIconPath() {
  const icoPath = path.join(BUILD_DIR, 'icon.ico');
  const pngPath = path.join(BUILD_DIR, 'icon.png');
  if (process.platform === 'win32' && fs.existsSync(icoPath)) return icoPath;
  if (fs.existsSync(pngPath)) return pngPath;
  return undefined;
}

function sendMenuAction(action, payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send('pvl:menu-action', { action, payload });
}

async function readPythonFileFromDisk(filePath) {
  const resolved = path.resolve(filePath);
  const stat = await fsp.stat(resolved);
  if (!stat.isFile()) {
    throw new Error('Selected path is not a regular file.');
  }
  if (stat.size > MAX_PYTHON_FILE_BYTES) {
    throw new Error('Python file exceeds 5 MB editor safety limit.');
  }
  const content = await fsp.readFile(resolved, 'utf8');
  return {
    canceled: false,
    filePath: resolved,
    fileName: path.basename(resolved),
    content,
  };
}

async function handleOpenPythonDialog() {
  if (!mainWindow || mainWindow.isDestroyed()) return { canceled: true };
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Python File',
    buttonLabel: 'Open in Playground',
    properties: ['openFile'],
    filters: [
      { name: 'Python Scripts', extensions: ['py'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
    return { canceled: true };
  }

  return readPythonFileFromDisk(result.filePaths[0]);
}

function buildNativeMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac
      ? [
          {
            label: APP_TITLE,
            submenu: [
              { role: 'about', label: `About ${APP_TITLE}` },
              { type: 'separator' },
              {
                label: 'Appearance Studio',
                accelerator: 'CmdOrCtrl+,',
                click: () => sendMenuAction('open-appearance'),
              },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Python File (.py)...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            try {
              const res = await handleOpenPythonDialog();
              if (!res.canceled) {
                sendMenuAction('open-py', res);
              }
            } catch (err) {
              if (mainWindow && !mainWindow.isDestroyed()) {
                dialog.showErrorBox('Unable to Open File', String(err?.message || err));
              }
            }
          },
        },
        {
          label: 'Save Python File (.py)',
          accelerator: 'CmdOrCtrl+S',
          click: () => sendMenuAction('save-py', { saveAs: false }),
        },
        {
          label: 'Save Python File As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => sendMenuAction('save-py', { saveAs: true }),
        },
        { type: 'separator' },
        {
          label: 'Export Progress (.json)...',
          click: () => sendMenuAction('export-backup'),
        },
        {
          label: 'Import Progress (.json)...',
          click: () => sendMenuAction('import-backup'),
        },
        { type: 'separator' },
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+1',
          click: () => sendMenuAction('navigate', { route: 'dashboard' }),
        },
        {
          label: 'Lessons Workspace',
          accelerator: 'CmdOrCtrl+2',
          click: () => sendMenuAction('navigate', { route: 'lesson' }),
        },
        {
          label: 'Python Playground',
          accelerator: 'CmdOrCtrl+3',
          click: () => sendMenuAction('navigate', { route: 'playground' }),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit', label: 'Exit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Search Topics & Methods...',
          accelerator: 'CmdOrCtrl+K',
          click: () => sendMenuAction('open-search'),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Appearance Studio...',
          accelerator: 'CmdOrCtrl+,',
          click: () => sendMenuAction('open-appearance'),
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: isMac ? 'Ctrl+Cmd+F' : 'F11',
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          },
        },
        { role: 'resetZoom', accelerator: 'CmdOrCtrl+0' },
        { role: 'zoomIn', accelerator: 'CmdOrCtrl+=' },
        { role: 'zoomOut', accelerator: 'CmdOrCtrl+-' },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools', accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Run Offline Engine Diagnostics',
          click: () => sendMenuAction('navigate', { route: 'selftest' }),
        },
        {
          label: 'Completion Certificate',
          click: () => sendMenuAction('navigate', { route: 'certificate' }),
        },
        {
          label: 'Credits & Desktop Shortcuts',
          click: () => sendMenuAction('navigate', { route: 'credits' }),
        },
        { type: 'separator' },
        {
          label: 'Check for Updates (GitHub)...',
          click: async () => {
            const info = await checkForGitHubReleaseUpdate(false);
            if (!mainWindow || mainWindow.isDestroyed()) return;
            if (info.status === 'update-available' && info.releaseUrl) {
              const choice = await dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Update Available',
                message: `${APP_TITLE} v${info.latestVersion} is available!`,
                detail: `You are currently using v${info.currentVersion}. Click Download Update to open the GitHub Releases page.`,
                buttons: ['Download Update', 'Later'],
                defaultId: 0,
              });
              if (choice.response === 0 && isSafeExternalHttpUrl(info.releaseUrl)) {
                void shell.openExternal(info.releaseUrl);
              }
            } else if (info.status === 'up-to-date') {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Up to Date',
                message: `You are running the latest version (v${info.currentVersion}).`,
              });
            } else {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Update Check Unavailable',
                message:
                  info.status === 'offline'
                    ? 'You appear to be offline. Updates are only checked when connected to the internet.'
                    : 'No GitHub Releases feed configured or reachable right now. Offline learning features remain unaffected.',
              });
            }
          },
        },
        {
          label: `About ${APP_TITLE}`,
          click: () => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: `About ${APP_TITLE}`,
              message: `${APP_TITLE} (Offline Desktop Edition)`,
              detail:
                `App Version: ${app.getVersion()}\n` +
                `Electron: ${process.versions.electron}\n` +
                `Python Engine: Bundled Offline Pyodide 3.12 WebAssembly Worker\n\n` +
                `All 30 interactive lessons, animations, notebooks, and progress storage run 100% locally offline.`,
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function registerCustomAppProtocol() {
  protocol.handle(APP_PROTOCOL_SCHEME, async (request) => {
    try {
      const reqUrl = new URL(request.url);
      if (reqUrl.hostname !== APP_PROTOCOL_HOST) {
        return new Response('Forbidden host', { status: 403 });
      }

      let relPath = decodeURIComponent(reqUrl.pathname || '/');
      if (relPath === '/' || relPath === '') {
        relPath = '/index.html';
      }

      // Normalize & confine strictly inside DIST_DIR
      const safeRel = relPath.replace(/^\/+/, '');
      let candidate = path.resolve(DIST_DIR, safeRel);
      if (!candidate.startsWith(DIST_DIR + path.sep) && candidate !== DIST_DIR) {
        return new Response('Forbidden path', { status: 403 });
      }

      // SPA fallback only for extensionless client navigation paths
      if (!fs.existsSync(candidate) || fs.statSync(candidate).isDirectory()) {
        if (!path.extname(safeRel)) {
          candidate = path.join(DIST_DIR, 'index.html');
        } else {
          return new Response('Not found', { status: 404 });
        }
      }

      const data = await fsp.readFile(candidate);
      const mimeType = getMimeType(candidate);
      const isHtml = mimeType.startsWith('text/html');
      const headers = {
        'Content-Type': mimeType,
        ...buildIsolationHeaders(isHtml, false),
      };

      return new Response(data, { status: 200, headers });
    } catch (err) {
      console.error('app:// protocol handler error:', err);
      return new Response('Internal server error', { status: 500 });
    }
  });
}

function registerDevIsolationHeaders() {
  if (!IS_DEV || !DEV_SERVER_URL) return;
  const devOrigin = new URL(DEV_SERVER_URL).origin;
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (!details.url.startsWith(devOrigin)) {
      callback({ responseHeaders: details.responseHeaders });
      return;
    }
    const headers = { ...details.responseHeaders };
    headers['Cross-Origin-Opener-Policy'] = ['same-origin'];
    headers['Cross-Origin-Embedder-Policy'] = ['require-corp'];
    headers['Cross-Origin-Resource-Policy'] = ['same-origin'];
    callback({ responseHeaders: headers });
  });
}

function registerAllowListedIpc() {
  ipcMain.handle('pvl:open-py-file', async (event) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    return handleOpenPythonDialog();
  });

  ipcMain.handle('pvl:save-py-file', async (event, payload) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    if (!mainWindow || mainWindow.isDestroyed()) return { canceled: true };
    if (!payload || typeof payload.content !== 'string') {
      throw new Error('Invalid Python file payload');
    }
    if (Buffer.byteLength(payload.content, 'utf8') > MAX_PYTHON_FILE_BYTES) {
      throw new Error('Python file content exceeds 5 MB limit');
    }

    const saveAs = Boolean(payload.saveAs);
    const existingPath = typeof payload.filePath === 'string' && payload.filePath.trim()
      ? path.resolve(payload.filePath)
      : '';

    let targetPath = !saveAs && existingPath ? existingPath : '';

    if (!targetPath) {
      const defaultName =
        typeof payload.defaultName === 'string' && payload.defaultName.trim()
          ? payload.defaultName.trim()
          : 'script.py';
      const safeDefault = defaultName.toLowerCase().endsWith('.py') ? defaultName : `${defaultName}.py`;

      const res = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Python File',
        defaultPath: existingPath || path.join(app.getPath('documents'), safeDefault),
        filters: [
          { name: 'Python Scripts', extensions: ['py'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (res.canceled || !res.filePath) {
        return { canceled: true };
      }
      targetPath = res.filePath;
    }

    await fsp.writeFile(targetPath, payload.content, 'utf8');
    return {
      canceled: false,
      filePath: targetPath,
      fileName: path.basename(targetPath),
    };
  });

  ipcMain.handle('pvl:toggle-fullscreen', (event) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    const next = !mainWindow.isFullScreen();
    mainWindow.setFullScreen(next);
    return next;
  });

  ipcMain.handle('pvl:open-external', async (event, rawUrl) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    if (!isSafeExternalHttpUrl(rawUrl)) {
      return false;
    }
    await shell.openExternal(rawUrl);
    return true;
  });

  ipcMain.handle('pvl:get-app-info', (event) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    return {
      isElectron: true,
      platform: process.platform,
      arch: process.arch,
      electronVersion: process.versions.electron,
      appVersion: app.getVersion(),
      isPackaged: app.isPackaged,
    };
  });

  ipcMain.handle('pvl:detect-native-python', async (event) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    return detectNativePythonInstallation();
  });

  ipcMain.handle('pvl:run-native-python', async (event, payload) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    return startNativePythonRun(payload);
  });

  ipcMain.handle('pvl:send-native-input', (event, payload) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    const runId = typeof payload?.runId === 'string' ? payload.runId : '';
    const value = typeof payload?.value === 'string' ? payload.value : '';
    const active = activeNativeRuns.get(runId);
    if (!active || !active.child || active.child.killed || !active.child.stdin) {
      return false;
    }
    try {
      active.child.stdin.write(`${value}\n`);
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle('pvl:stop-native-python', (event, runId) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    if (typeof runId === 'string' && runId) {
      return stopNativePythonRun(runId);
    }
    let stoppedAny = false;
    for (const id of Array.from(activeNativeRuns.keys())) {
      if (stopNativePythonRun(id)) stoppedAny = true;
    }
    return stoppedAny;
  });

  ipcMain.handle('pvl:check-updates', async (event) => {
    if (!isTrustedInternalUrl(event.senderFrame?.url || '')) {
      throw new Error('Untrusted IPC origin');
    }
    return checkForGitHubReleaseUpdate(true);
  });
}

// =========================================================================
// Optional GitHub Releases Feed Auto-Update Check (Online-Only, Fail-Silent)
// =========================================================================

function getGitHubRepoSlug() {
  try {
    const pkgPath = path.join(ROOT_DIR, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const rawUrl = typeof pkg?.repository === 'string' ? pkg.repository : pkg?.repository?.url;
    if (typeof rawUrl !== 'string' || !rawUrl.trim()) return null;
    const cleaned = rawUrl.trim().replace(/^git\+/, '').replace(/\.git$/i, '');
    const parsed = new URL(cleaned);
    if (parsed.hostname.toLowerCase() !== 'github.com') return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    const repo = parts[1];
    if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) return null;
    return `${owner}/${repo}`;
  } catch {
    return null;
  }
}

function compareSemver(a, b) {
  const pa = String(a).replace(/^[vV]/, '').split('-')[0].split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).replace(/^[vV]/, '').split('-')[0].split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

async function checkForGitHubReleaseUpdate(silent = true) {
  const currentVersion = app.getVersion();
  try {
    if (!net.isOnline()) {
      return { status: 'offline', currentVersion };
    }
    const slug = getGitHubRepoSlug();
    if (!slug) {
      return { status: 'unconfigured', currentVersion };
    }

    const feedUrl = `https://github.com/${slug}/releases.atom`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await net.fetch(feedUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/atom+xml, application/xml, text/xml' },
      });
      if (!response.ok) {
        return { status: 'silent-error', currentVersion };
      }
      const xml = await response.text();
      const firstEntryMatch = xml.match(/<entry>[\s\S]*?<\/entry>/);
      if (!firstEntryMatch) {
        return { status: 'up-to-date', currentVersion };
      }

      const entryXml = firstEntryMatch[0];
      const hrefMatch = entryXml.match(/<link[^>]+href="([^"]+)"/i);
      const releaseUrl = hrefMatch ? hrefMatch[1] : `https://github.com/${slug}/releases`;
      const tagMatch = releaseUrl.match(/\/releases\/tag\/([^/?#]+)/i);
      const rawTag = tagMatch ? decodeURIComponent(tagMatch[1]) : '';
      const latestVersion = rawTag.replace(/^[vV]/, '');

      if (!latestVersion || !/^\d+\.\d+\.\d+/.test(latestVersion)) {
        return { status: 'up-to-date', currentVersion };
      }

      if (compareSemver(latestVersion, currentVersion) > 0) {
        const result = {
          status: 'update-available',
          currentVersion,
          latestVersion,
          releaseUrl: releaseUrl.startsWith(`https://github.com/${slug}/`)
            ? releaseUrl
            : `https://github.com/${slug}/releases/latest`,
        };
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('pvl:update-status', result);
        }
        return result;
      }

      return { status: 'up-to-date', currentVersion, latestVersion };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    if (!silent) {
      return { status: 'silent-error', currentVersion };
    }
    return { status: 'silent-error', currentVersion };
  }
}

// =========================================================================
// Optional Native Python Detection & Streaming Child Process Execution
// =========================================================================

const activeNativeRuns = new Map();

function execFilePromise(cmd, args, timeout = 3500) {
  return new Promise((resolve, reject) => {
    execFile(
      cmd,
      args,
      {
        windowsHide: true,
        timeout,
        shell: false,
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout: String(stdout || ''), stderr: String(stderr || '') });
        }
      }
    );
  });
}

function getNativeWorkspaceDir() {
  try {
    const dir = path.join(app.getPath('documents'), 'Python Visual Lab Workspace');
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  } catch {
    const fallback = path.join(app.getPath('userData'), 'native-workspace');
    fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

function getNativePythonCandidates() {
  const candidates = [];
  if (process.platform === 'win32') {
    candidates.push({ command: 'py', prefixArgs: ['-3'] });
    candidates.push({ command: 'python', prefixArgs: [] });
    candidates.push({ command: 'python3', prefixArgs: [] });

    const localPrograms = process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Programs', 'Python')
      : '';
    if (localPrograms && fs.existsSync(localPrograms)) {
      try {
        for (const dirName of fs.readdirSync(localPrograms)) {
          const exePath = path.join(localPrograms, dirName, 'python.exe');
          if (fs.existsSync(exePath)) {
            candidates.push({ command: exePath, prefixArgs: [] });
          }
        }
      } catch {
        // Ignore scan error
      }
    }

    const sysDrive = process.env.SystemDrive || 'C:';
    try {
      for (const entry of fs.readdirSync(sysDrive + path.sep)) {
        if (/^Python3\d+$/i.test(entry)) {
          const exePath = path.join(sysDrive + path.sep, entry, 'python.exe');
          if (fs.existsSync(exePath)) {
            candidates.push({ command: exePath, prefixArgs: [] });
          }
        }
      }
    } catch {
      // Ignore scan error
    }
  } else {
    candidates.push({ command: 'python3', prefixArgs: [] });
    candidates.push({ command: 'python', prefixArgs: [] });
    for (const fixedPath of ['/usr/local/bin/python3', '/opt/homebrew/bin/python3', '/usr/bin/python3']) {
      if (fs.existsSync(fixedPath)) {
        candidates.push({ command: fixedPath, prefixArgs: [] });
      }
    }
  }
  return candidates;
}

async function detectNativePythonInstallation() {
  const probeScript = [
    'import sys, importlib.util',
    'print(sys.version_info[0])',
    'print(".".join(map(str, sys.version_info[:3])))',
    'print(sys.executable)',
    'print("1" if importlib.util.find_spec("pip") else "0")',
  ].join('; ');

  const candidates = getNativePythonCandidates();
  const seenExes = new Set();

  for (const cand of candidates) {
    try {
      const { stdout } = await execFilePromise(cand.command, [...cand.prefixArgs, '-c', probeScript]);
      const lines = stdout
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length < 3) continue;
      const major = parseInt(lines[0], 10);
      const version = lines[1];
      const executable = lines[2];
      const pipAvailable = lines[3] === '1';

      if (major !== 3 || !executable || seenExes.has(executable)) continue;
      seenExes.add(executable);

      return {
        found: true,
        executable,
        version,
        pipAvailable,
        workspaceDir: getNativeWorkspaceDir(),
        message: `Detected Python ${version} at ${executable}${pipAvailable ? ' (pip ready)' : ''}.`,
      };
    } catch {
      // Try next candidate
    }
  }

  return {
    found: false,
    executable: null,
    version: null,
    pipAvailable: false,
    workspaceDir: getNativeWorkspaceDir(),
    message:
      'No Python 3 installation was found on this computer. Staying on the Built-in offline Python engine so everything continues working. Install Python 3 from python.org (or the Microsoft Store on Windows) and click Check Again to enable Native mode.',
  };
}

function sendNativeEvent(payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send('pvl:native-python-event', payload);
}

function killNativeChildTree(child) {
  if (!child || !child.pid) return;
  if (process.platform === 'win32') {
    execFile('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true }, () => {
      try {
        if (!child.killed) child.kill('SIGKILL');
      } catch {
        // Ignore
      }
    });
  } else {
    try {
      child.kill('SIGKILL');
    } catch {
      // Ignore
    }
  }
}

function stopNativePythonRun(runId) {
  const entry = activeNativeRuns.get(runId);
  if (!entry) return false;
  entry.stopped = true;
  if (entry.timer) clearTimeout(entry.timer);
  killNativeChildTree(entry.child);
  return true;
}

function stopAllNativeRuns() {
  for (const id of Array.from(activeNativeRuns.keys())) {
    stopNativePythonRun(id);
  }
}

function buildNativeRunnerScript() {
  return String.raw`import builtins
import json
import sys
import traceback

cfg_path = sys.argv[1]
with open(cfg_path, "r", encoding="utf-8") as cf:
    cfg = json.load(cf)

code = cfg["code"]
mode = cfg.get("mode", "run")
max_steps = int(cfg.get("max_steps", 300))
trace_path = cfg["trace_path"]
input_queue = list(cfg.get("input_queue", []))
input_idx = 0

def _pvl_native_input(prompt=""):
    global input_idx
    prompt_str = "" if prompt is None else str(prompt)
    if input_idx < len(input_queue):
        val = str(input_queue[input_idx])
        input_idx += 1
        if prompt_str:
            sys.stdout.write(prompt_str)
        sys.stdout.write(val + "\n")
        sys.stdout.flush()
        return val
    if prompt_str:
        sys.stdout.write(prompt_str)
        sys.stdout.flush()
    sys.stdout.write("\x1ePVL_INPUT_REQ:" + json.dumps(prompt_str) + "\x1e\n")
    sys.stdout.flush()
    line = sys.stdin.readline()
    if line == "":
        raise EOFError("EOF when reading a line")
    return line.rstrip("\r\n")

builtins.input = _pvl_native_input

if mode == "trace":
    steps = []
    truncated = False

    def _safe_repr(val):
        try:
            r = repr(val)
            return r[:157] + "..." if len(r) > 160 else r
        except Exception:
            return "<unrepresentable>"

    def _snapshot(ns):
        out = {}
        for k, v in ns.items():
            if k.startswith("__") or callable(v) or isinstance(v, type(sys)):
                continue
            out[k] = {
                "name": k,
                "type": type(v).__name__,
                "repr": _safe_repr(v),
                "objectId": id(v),
                "isMutable": isinstance(v, (list, dict, set, bytearray)),
            }
        return out

    def _tracer(frame, event, arg):
        global truncated
        if frame.f_code.co_filename != "<playground.py>":
            return _tracer
        if event not in ("line", "call", "return", "exception"):
            return _tracer
        if len(steps) >= max_steps:
            truncated = True
            return None
        fn_name = frame.f_code.co_name
        scope_vars = _snapshot(frame.f_locals) if fn_name != "<module>" else _snapshot(frame.f_globals)
        steps.append({
            "stepNumber": len(steps) + 1,
            "line": frame.f_lineno,
            "event": event,
            "functionName": fn_name,
            "scope": "module" if fn_name == "<module>" else "local",
            "variables": scope_vars,
            "stdoutDelta": "",
        })
        return _tracer

    ns = {"__name__": "__main__", "__builtins__": builtins}
    try:
        compiled = compile(code, "<playground.py>", "exec")
        sys.settrace(_tracer)
        exec(compiled, ns, ns)
    except Exception:
        traceback.print_exc()
        sys.settrace(None)
        with open(trace_path, "w", encoding="utf-8") as tf:
            json.dump({"steps": steps, "totalSteps": len(steps), "truncated": truncated}, tf)
        sys.exit(1)
    finally:
        sys.settrace(None)

    with open(trace_path, "w", encoding="utf-8") as tf:
        json.dump({"steps": steps, "totalSteps": len(steps), "truncated": truncated}, tf)
else:
    ns = {"__name__": "__main__", "__builtins__": builtins}
    compiled = compile(code, "<playground.py>", "exec")
    exec(compiled, ns, ns)
`;
}

async function startNativePythonRun(payload) {
  const runId = typeof payload?.runId === 'string' && payload.runId.trim()
    ? payload.runId.trim()
    : `native-${Date.now()}`;
  const code = typeof payload?.code === 'string' ? payload.code : '';
  const mode = payload?.mode === 'trace' ? 'trace' : 'run';
  const inputQueue = Array.isArray(payload?.inputQueue) ? payload.inputQueue.map(String) : [];
  const maxSteps = Math.max(10, Math.min(2000, Number(payload?.maxSteps) || 300));
  const timeLimitMs = Math.max(1000, Math.min(120000, Number(payload?.timeLimitMs) || 10000));

  if (Buffer.byteLength(code, 'utf8') > MAX_PYTHON_FILE_BYTES) {
    throw new Error('Code exceeds 5 MB safety limit.');
  }

  const detected = await detectNativePythonInstallation();
  if (!detected.found || !detected.executable) {
    return {
      started: false,
      detected,
    };
  }

  const tempDir = path.join(os.tmpdir(), 'pvl-native-runner');
  await fsp.mkdir(tempDir, { recursive: true });
  const safeId = runId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const runnerPath = path.join(tempDir, `runner_${safeId}.py`);
  const configPath = path.join(tempDir, `cfg_${safeId}.json`);
  const tracePath = path.join(tempDir, `trace_${safeId}.json`);

  await fsp.writeFile(runnerPath, buildNativeRunnerScript(), 'utf8');
  await fsp.writeFile(
    configPath,
    JSON.stringify({
      code,
      mode,
      max_steps: maxSteps,
      trace_path: tracePath,
      input_queue: inputQueue,
    }),
    'utf8'
  );

  const startedAt = Date.now();
  const child = spawn(detected.executable, ['-u', runnerPath, configPath], {
    cwd: detected.workspaceDir || getNativeWorkspaceDir(),
    shell: false,
    windowsHide: true,
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      PYTHONUNBUFFERED: '1',
    },
  });

  const runState = {
    child,
    stopped: false,
    timedOut: false,
    timer: null,
  };
  activeNativeRuns.set(runId, runState);

  runState.timer = setTimeout(() => {
    runState.timedOut = true;
    killNativeChildTree(child);
  }, timeLimitMs);

  let carry = '';
  const INPUT_MARKER_RE = /\x1ePVL_INPUT_REQ:(.*?)\x1e\r?\n/g;

  child.stdout.on('data', (chunk) => {
    const combined = carry + chunk.toString('utf8');
    carry = '';

    // Hold back partial sentinel if split across stream frames
    const incompleteIdx = combined.lastIndexOf('\x1ePVL_INPUT_REQ:');
    let processable = combined;
    if (incompleteIdx !== -1 && combined.indexOf('\n', incompleteIdx) === -1) {
      processable = combined.slice(0, incompleteIdx);
      carry = combined.slice(incompleteIdx);
    }

    let cleanText = '';
    let lastPos = 0;
    INPUT_MARKER_RE.lastIndex = 0;
    let match;
    while ((match = INPUT_MARKER_RE.exec(processable)) !== null) {
      cleanText += processable.slice(lastPos, match.index);
      lastPos = INPUT_MARKER_RE.lastIndex;
      let parsedPrompt = '';
      try {
        parsedPrompt = JSON.parse(match[1]);
      } catch {
        parsedPrompt = match[1];
      }
      if (cleanText) {
        sendNativeEvent({ runId, event: 'stdout', data: cleanText });
        cleanText = '';
      }
      sendNativeEvent({ runId, event: 'input-request', prompt: String(parsedPrompt || 'Enter input:') });
    }
    cleanText += processable.slice(lastPos);
    if (cleanText) {
      sendNativeEvent({ runId, event: 'stdout', data: cleanText });
    }
  });

  child.stderr.on('data', (chunk) => {
    sendNativeEvent({ runId, event: 'stderr', data: chunk.toString('utf8') });
  });

  child.on('error', (err) => {
    if (runState.timer) clearTimeout(runState.timer);
    activeNativeRuns.delete(runId);
    sendNativeEvent({
      runId,
      event: 'error',
      message: String(err?.message || err),
    });
  });

  child.on('close', async (exitCode) => {
    if (runState.timer) clearTimeout(runState.timer);
    activeNativeRuns.delete(runId);
    if (carry) {
      sendNativeEvent({ runId, event: 'stdout', data: carry });
    }

    let tracePayload = null;
    if (mode === 'trace' && fs.existsSync(tracePath)) {
      try {
        const rawTrace = await fsp.readFile(tracePath, 'utf8');
        tracePayload = JSON.parse(rawTrace);
      } catch {
        tracePayload = null;
      }
    }

    // Best-effort cleanup of temp runner files
    await Promise.all([
      fsp.unlink(runnerPath).catch(() => {}),
      fsp.unlink(configPath).catch(() => {}),
      fsp.unlink(tracePath).catch(() => {}),
    ]);

    sendNativeEvent({
      runId,
      event: 'done',
      exitCode: typeof exitCode === 'number' ? exitCode : 1,
      stopped: runState.stopped,
      timedOut: runState.timedOut,
      durationMs: Date.now() - startedAt,
      tracePayload,
    });
  });

  return {
    started: true,
    runId,
    detected,
  };
}

function createMainWindow() {
  const initialState = loadWindowState();
  const iconPath = resolveAppIconPath();

  const win = new BrowserWindow({
    x: initialState.x,
    y: initialState.y,
    width: initialState.width,
    height: initialState.height,
    minWidth: 800,
    minHeight: 560,
    title: `${APP_TITLE} — 30 Days of Python`,
    icon: iconPath,
    backgroundColor: '#0f172a',
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: PRELOAD_PATH,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false,
    },
  });

  mainWindow = win;

  // Block new popup windows; forward safe http/https links to OS default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalHttpUrl(url)) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Block external navigation inside the app window
  win.webContents.on('will-navigate', (event, url) => {
    if (!isTrustedInternalUrl(url)) {
      event.preventDefault();
      if (isSafeExternalHttpUrl(url)) {
        void shell.openExternal(url);
      }
    }
  });

  // Persist window geometry cleanly on resize/move/state transitions
  let saveTimer = null;
  const scheduleSave = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveWindowState(win), 250);
  };

  win.on('resize', scheduleSave);
  win.on('move', scheduleSave);
  win.on('maximize', scheduleSave);
  win.on('unmaximize', scheduleSave);
  win.on('enter-full-screen', scheduleSave);
  win.on('leave-full-screen', scheduleSave);
  win.on('close', () => saveWindowState(win));

  win.once('ready-to-show', () => {
    if (initialState.isMaximized) {
      win.maximize();
    }
    if (initialState.isFullScreen) {
      win.setFullScreen(true);
    }
    win.show();

    // Optional background update check only when online; completely silent when offline
    setTimeout(() => {
      void checkForGitHubReleaseUpdate(true);
    }, 6000);
  });

  win.webContents.on('did-finish-load', async () => {
    if (pendingOpenFilePath) {
      const target = pendingOpenFilePath;
      pendingOpenFilePath = null;
      try {
        const fileData = await readPythonFileFromDisk(target);
        sendMenuAction('open-py', fileData);
      } catch (err) {
        console.warn('Could not open startup .py file:', err);
      }
    }
  });

  win.on('closed', () => {
    mainWindow = null;
  });

  if (IS_DEV) {
    void win.loadURL(DEV_SERVER_URL);
  } else {
    void win.loadURL(`${APP_ORIGIN}/index.html`);
  }
}

app.on('second-instance', async (_event, argv) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    const extraPy = extractPythonArgPath(argv.slice(1));
    if (extraPy) {
      try {
        const fileData = await readPythonFileFromDisk(extraPy);
        sendMenuAction('open-py', fileData);
      } catch (err) {
        console.warn('Could not open second-instance .py file:', err);
      }
    }
  }
});

app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalHttpUrl(url)) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });
});

app.whenReady().then(() => {
  // Deny arbitrary browser permission prompts (camera, geo, notifications, etc.)
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  registerCustomAppProtocol();
  registerDevIsolationHeaders();
  registerAllowListedIpc();
  buildNativeMenu();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('before-quit', () => {
  stopAllNativeRuns();
});

app.on('window-all-closed', () => {
  stopAllNativeRuns();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
