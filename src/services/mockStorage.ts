const MOCK_API_DELAY_MS = 1000;
const APP_SESSION_STORAGE_KEY = 'acqua-pet-session-state';
const APP_SESSION_UPDATED_EVENT = 'acqua-pet:session-updated';

const isBrowser = typeof window !== 'undefined';

export const simulateApiDelay = async <T>(value: T, delay = MOCK_API_DELAY_MS): Promise<T> =>
  new Promise((resolve) => {
    globalThis.setTimeout(() => resolve(value), delay);
  });

export const readSessionState = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;

  const raw = window.sessionStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeSessionState = <T>(key: string, value: T) => {
  if (!isBrowser) return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

export const readSeededSessionState = <T>(key: string, fallback: T): T => {
  const current = readSessionState<T | null>(key, null);
  if (current !== null) return current;

  writeSessionState(key, fallback);
  return fallback;
};

type AppSessionState = Record<string, unknown>;

const dispatchAppSessionUpdated = (slice: string) => {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(APP_SESSION_UPDATED_EVENT, { detail: { slice } }));
};

const readAppSessionRoot = (): AppSessionState => {
  if (!isBrowser) return {};

  const raw = window.sessionStorage.getItem(APP_SESSION_STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as AppSessionState;
  } catch {
    return {};
  }
};

const writeAppSessionRoot = (value: AppSessionState) => {
  if (!isBrowser) return;
  window.sessionStorage.setItem(APP_SESSION_STORAGE_KEY, JSON.stringify(value));
};

export const readAppSessionSlice = <T>(slice: string, fallback: T): T => {
  const root = readAppSessionRoot();
  return (slice in root ? (root[slice] as T) : fallback);
};

export const writeAppSessionSlice = <T>(slice: string, value: T) => {
  const root = readAppSessionRoot();
  writeAppSessionRoot({
    ...root,
    [slice]: value
  });
  dispatchAppSessionUpdated(slice);
};

export const readSeededAppSessionSlice = <T>(slice: string, fallback: T): T => {
  const root = readAppSessionRoot();
  if (slice in root) return root[slice] as T;
  writeAppSessionRoot({
    ...root,
    [slice]: fallback
  });
  dispatchAppSessionUpdated(slice);
  return fallback;
};

export const subscribeToAppSessionUpdates = (listener: () => void) => {
  if (!isBrowser) return () => undefined;

  const handleUpdate = () => {
    listener();
  };

  window.addEventListener(APP_SESSION_UPDATED_EVENT, handleUpdate);
  return () => {
    window.removeEventListener(APP_SESSION_UPDATED_EVENT, handleUpdate);
  };
};
