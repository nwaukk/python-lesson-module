/**
 * Python Visual Lab — Electron Preload Bridge
 * Strictly isolated preload script (contextIsolation: true, nodeIntegration: false).
 * Exposes ONLY an explicit allow-list of safe IPC channels.
 */
'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const ALLOWED_INVOKE_CHANNELS = new Set([
  'pvl:open-py-file',
  'pvl:save-py-file',
  'pvl:toggle-fullscreen',
  'pvl:open-external',
  'pvl:get-app-info',
  'pvl:detect-native-python',
  'pvl:run-native-python',
  'pvl:send-native-input',
  'pvl:stop-native-python',
  'pvl:check-updates',
]);

const ALLOWED_RECEIVE_CHANNELS = new Set([
  'pvl:menu-action',
  'pvl:native-python-event',
  'pvl:update-status',
]);

function safeInvoke(channel, payload) {
  if (!ALLOWED_INVOKE_CHANNELS.has(channel)) {
    return Promise.reject(new Error(`Blocked IPC invoke channel: ${channel}`));
  }
  return ipcRenderer.invoke(channel, payload);
}

function safeSubscribe(channel, callback) {
  if (!ALLOWED_RECEIVE_CHANNELS.has(channel) || typeof callback !== 'function') {
    return () => {};
  }
  const wrapped = (_event, payload) => {
    callback(payload);
  };
  ipcRenderer.on(channel, wrapped);
  return () => {
    ipcRenderer.removeListener(channel, wrapped);
  };
}

contextBridge.exposeInMainWorld('pythonVisualLabDesktop', {
  isElectron: true,
  openPythonFile: () => safeInvoke('pvl:open-py-file'),
  savePythonFile: (payload) => safeInvoke('pvl:save-py-file', payload),
  toggleFullscreen: () => safeInvoke('pvl:toggle-fullscreen'),
  openExternal: (url) => safeInvoke('pvl:open-external', url),
  getAppInfo: () => safeInvoke('pvl:get-app-info'),
  detectNativePython: () => safeInvoke('pvl:detect-native-python'),
  runNativePython: (payload) => safeInvoke('pvl:run-native-python', payload),
  sendNativePythonInput: (payload) => safeInvoke('pvl:send-native-input', payload),
  stopNativePython: (runId) => safeInvoke('pvl:stop-native-python', runId),
  checkForUpdates: () => safeInvoke('pvl:check-updates'),
  onMenuAction: (callback) => safeSubscribe('pvl:menu-action', callback),
  onNativePythonEvent: (callback) => safeSubscribe('pvl:native-python-event', callback),
  onUpdateStatus: (callback) => safeSubscribe('pvl:update-status', callback),
});
