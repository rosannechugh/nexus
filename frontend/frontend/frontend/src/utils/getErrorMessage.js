/**
 * Generic Axios-error -> user-facing-string translator for non-auth API
 * calls (research sessions, documents, etc). Never surfaces raw stack
 * traces or backend internals.
 */
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error?.response) {
    return "Can't reach the NEXUS server. Check your connection and try again.";
  }

  const { status, data } = error.response;
  const detail = data?.detail;

  if (status === 422 && Array.isArray(detail)) {
    return detail.map((d) => d.msg).filter(Boolean).join(" ") || fallback;
  }

  if (typeof detail === "string") return detail;

  if (status === 500) {
    return "Something went wrong on our end. Please try again shortly.";
  }

  return fallback;
}
