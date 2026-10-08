/**
 * Resolves the backend NestJS API URL safely across all environments (Local, Docker, Render Cloud).
 * Automatically handles Render's `property: host` environment variables that lack `https://` protocol.
 */
export function getBackendApiUrl(): string {
  let url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  url = url.trim().replace(/\/+$/, "");

  if (!url) {
    return "http://localhost:4000";
  }

  // If already starts with http:// or https://
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it's a Render service name (e.g. "codearena-api-4qss" or "codearena-api") without a domain
  if (url.includes("codearena-api") && !url.includes(".")) {
    return `https://${url}.onrender.com`;
  }

  // If it's a domain name (e.g. "codearena-api-4qss.onrender.com")
  if (url.includes(".")) {
    if (url.startsWith("localhost") || url.startsWith("127.0.0.1")) {
      return `http://${url}`;
    }
    return `https://${url}`;
  }

  // Fallback: assume https
  return `https://${url}`;
}
