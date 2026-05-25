export type AppView = 'landing' | 'store' | 'client' | 'admin' | 'veterinary';

export const normalizeAppPath = (pathname: string) => {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return normalizedPath || '/';
};

export const getAppViewFromPath = (pathname: string): AppView => {
  const normalizedPath = normalizeAppPath(pathname);

  if (normalizedPath.startsWith('/area-admin')) return 'admin';
  if (normalizedPath.startsWith('/area-veterinario')) return 'veterinary';
  if (normalizedPath.startsWith('/area-cliente')) return 'client';
  if (normalizedPath.startsWith('/loja')) return 'store';

  return 'landing';
};
