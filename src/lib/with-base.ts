const LEGACY_BASE = '/pencil-design-site';

export function withBase(path: string, baseUrl = import.meta.env.BASE_URL) {
  const normalizedPath = path.startsWith(LEGACY_BASE)
    ? path.slice(LEGACY_BASE.length) || '/'
    : path;

  const cleanedPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  const cleanedBase = (baseUrl || '/').replace(/\/$/, '');

  if (!cleanedBase) {
    return cleanedPath;
  }

  return `${cleanedBase}${cleanedPath}`;
}
