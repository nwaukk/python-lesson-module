/**
 * Desktop Shell Bridge
 * Connects cleanly to the Electron preload API when running inside the
 * desktop app and provides safe browser fallbacks on the web.
 */

export interface DesktopFileOpenResult {
  canceled: boolean;
  filePath?: string;
  fileName?: string;
  content?: string;
}

export interface DesktopFileSavePayload {
  content: string;
  filePath?: string;
  defaultName?: string;
  saveAs?: boolean;
}

export interface DesktopFileSaveResult {
  canceled: boolean;
  filePath?: string;
  fileName?: string;
}

export interface DesktopAppInfo {
  isElectron: boolean;
  platform: string;
  arch: string;
  electronVersion: string;
  appVersion: string;
  isPackaged: boolean;
}

export interface DesktopMenuActionEvent {
  action:
    | 'open-py'
    | 'save-py'
    | 'export-backup'
    | 'import-backup'
    | 'navigate'
    | 'open-search'
    | 'open-appearance';
  payload?: any;
}

export interface NativePythonDetectionResult {
  found: boolean;
  executable: string | null;
  version: string | null;
  pipAvailable: boolean;
  workspaceDir?: string;
  message: string;
}

export interface NativePythonRunPayload {
  runId: string;
  code: string;
  mode: 'run' | 'trace';
  inputQueue?: string[];
  timeLimitMs?: number;
  maxSteps?: number;
}

export interface NativePythonStartResult {
  started: boolean;
  runId?: string;
  detected: NativePythonDetectionResult;
}

export interface NativePythonEvent {
  runId: string;
  event: 'stdout' | 'stderr' | 'input-request' | 'done' | 'error';
  data?: string;
  prompt?: string;
  message?: string;
  exitCode?: number;
  stopped?: boolean;
  timedOut?: boolean;
  durationMs?: number;
  tracePayload?: {
    steps: any[];
    totalSteps: number;
    truncated: boolean;
  } | null;
}

export interface DesktopUpdateStatus {
  status: 'update-available' | 'up-to-date' | 'offline' | 'unconfigured' | 'silent-error';
  currentVersion: string;
  latestVersion?: string;
  releaseUrl?: string;
}

interface ElectronDesktopApi {
  isElectron?: boolean;
  openPythonFile: () => Promise<DesktopFileOpenResult>;
  savePythonFile: (payload: DesktopFileSavePayload) => Promise<DesktopFileSaveResult>;
  toggleFullscreen: () => Promise<boolean>;
  openExternal: (url: string) => Promise<boolean>;
  getAppInfo: () => Promise<DesktopAppInfo>;
  detectNativePython: () => Promise<NativePythonDetectionResult>;
  runNativePython: (payload: NativePythonRunPayload) => Promise<NativePythonStartResult>;
  sendNativePythonInput: (payload: { runId: string; value: string }) => Promise<boolean>;
  stopNativePython: (runId?: string) => Promise<boolean>;
  checkForUpdates?: () => Promise<DesktopUpdateStatus>;
  onMenuAction: (callback: (event: DesktopMenuActionEvent) => void) => () => void;
  onNativePythonEvent: (callback: (event: NativePythonEvent) => void) => () => void;
  onUpdateStatus?: (callback: (status: DesktopUpdateStatus) => void) => () => void;
}

declare global {
  interface Window {
    pythonVisualLabDesktop?: ElectronDesktopApi;
  }
}

function getElectronApi(): ElectronDesktopApi | null {
  if (typeof window === 'undefined') return null;
  const api = window.pythonVisualLabDesktop;
  return api && api.isElectron ? api : null;
}

export function isElectronDesktop(): boolean {
  return Boolean(getElectronApi());
}

export async function getDesktopAppInfo(): Promise<DesktopAppInfo> {
  const api = getElectronApi();
  if (api) {
    try {
      return await api.getAppInfo();
    } catch {
      // Fallback below
    }
  }
  return {
    isElectron: false,
    platform: typeof navigator !== 'undefined' ? navigator.platform || 'web' : 'web',
    arch: 'wasm',
    electronVersion: '',
    appVersion: '2.0.0',
    isPackaged: false,
  };
}

export async function openPythonFileDialog(): Promise<DesktopFileOpenResult> {
  const api = getElectronApi();
  if (api) {
    return api.openPythonFile();
  }

  // Web browser fallback using local file picker
  return new Promise<DesktopFileOpenResult>((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.py,.txt';
    let settled = false;

    const finish = (res: DesktopFileOpenResult) => {
      if (settled) return;
      settled = true;
      resolve(res);
    };

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        finish({ canceled: true });
        return;
      }
      const content = await file.text();
      finish({
        canceled: false,
        fileName: file.name,
        content,
      });
    };

    input.oncancel = () => finish({ canceled: true });
    input.click();
  });
}

export async function savePythonFileDialog(
  payload: DesktopFileSavePayload
): Promise<DesktopFileSaveResult> {
  const api = getElectronApi();
  if (api) {
    return api.savePythonFile(payload);
  }

  // Web browser fallback triggers standard .py file download
  const rawName = payload.defaultName?.trim() || 'script.py';
  const filename = rawName.toLowerCase().endsWith('.py') ? rawName : `${rawName}.py`;
  const blob = new Blob([payload.content], { type: 'text/x-python;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return {
    canceled: false,
    fileName: filename,
  };
}

export async function toggleDesktopFullscreen(): Promise<boolean> {
  const api = getElectronApi();
  if (api) {
    return api.toggleFullscreen();
  }

  if (typeof document !== 'undefined') {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return true;
      } else {
        await document.exitFullscreen();
        return false;
      }
    } catch {
      return Boolean(document.fullscreenElement);
    }
  }
  return false;
}

export async function openExternalSafeUrl(url: string): Promise<boolean> {
  const api = getElectronApi();
  if (api) {
    return api.openExternal(url);
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const link = document.createElement('a');
    link.href = parsed.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    return true;
  } catch {
    return false;
  }
}

export function subscribeDesktopMenuActions(
  handler: (event: DesktopMenuActionEvent) => void
): () => void {
  const api = getElectronApi();
  if (!api) return () => {};
  return api.onMenuAction(handler);
}

export async function detectNativePython(): Promise<NativePythonDetectionResult> {
  const api = getElectronApi();
  if (!api || !api.detectNativePython) {
    return {
      found: false,
      executable: null,
      version: null,
      pipAvailable: false,
      message:
        'Native Python mode is only available in the installed Desktop app when Python 3 is installed on your computer. Staying on the Built-in offline Python engine.',
    };
  }
  try {
    return await api.detectNativePython();
  } catch (err: any) {
    return {
      found: false,
      executable: null,
      version: null,
      pipAvailable: false,
      message:
        err?.message ||
        'Unable to detect a system Python installation. Staying on the Built-in offline Python engine.',
    };
  }
}

export async function runNativePythonProcess(
  payload: NativePythonRunPayload
): Promise<NativePythonStartResult> {
  const api = getElectronApi();
  if (!api || !api.runNativePython) {
    return {
      started: false,
      detected: await detectNativePython(),
    };
  }
  return api.runNativePython(payload);
}

export async function sendNativePythonInput(runId: string, value: string): Promise<boolean> {
  const api = getElectronApi();
  if (!api || !api.sendNativePythonInput) return false;
  return api.sendNativePythonInput({ runId, value });
}

export async function stopNativePythonProcess(runId?: string): Promise<boolean> {
  const api = getElectronApi();
  if (!api || !api.stopNativePython) return false;
  return api.stopNativePython(runId);
}

export function subscribeNativePythonEvents(
  handler: (event: NativePythonEvent) => void
): () => void {
  const api = getElectronApi();
  if (!api || !api.onNativePythonEvent) return () => {};
  return api.onNativePythonEvent(handler);
}

export async function checkForAppUpdates(): Promise<DesktopUpdateStatus> {
  const api = getElectronApi();
  if (!api || !api.checkForUpdates) {
    return { status: 'unconfigured', currentVersion: '2.0.0' };
  }
  try {
    return await api.checkForUpdates();
  } catch {
    return { status: 'silent-error', currentVersion: '2.0.0' };
  }
}

export function subscribeDesktopUpdateStatus(
  handler: (status: DesktopUpdateStatus) => void
): () => void {
  const api = getElectronApi();
  if (!api || !api.onUpdateStatus) return () => {};
  return api.onUpdateStatus(handler);
}
