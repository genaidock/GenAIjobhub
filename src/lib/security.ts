/**
 * Validates and sanitizes redirect URLs to prevent Open Redirect vulnerabilities (CWE-601).
 * Ensures destination is strictly a relative path on the same origin and prevents protocol-relative
 * or backslash evasion techniques.
 *
 * @param target - The requested redirect destination
 * @param fallback - Safe default fallback path
 * @returns A validated safe relative path
 */
export function getSafeRedirectUrl(target: string | null | undefined, fallback: string = '/'): string {
  if (!target || typeof target !== 'string') {
    return fallback;
  }

  const trimmed = target.trim();

  // Must start with a single '/' and cannot start with '//', '/\', or '\\'
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.startsWith('\\')) {
    return fallback;
  }

  // Prevent backslash evasion (e.g. /path\evil.com)
  if (trimmed.includes('\\')) {
    return fallback;
  }

  // Prevent control characters or javascript: schemes
  if (/[\u0000-\u001F\u007F-\u009F]/.test(trimmed) || trimmed.toLowerCase().includes('javascript:')) {
    return fallback;
  }

  return trimmed;
}
