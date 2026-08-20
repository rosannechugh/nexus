/**
 * Translates an Axios error from the NEXUS auth endpoints into a short,
 * user-facing message. Never surfaces raw stack traces or backend
 * internals — falls back to a generic message when the shape of the
 * error is unexpected.
 */
export function getAuthErrorMessage(error, { context = "auth" } = {}) {
  // No response at all: request never reached the server (backend down,
  // wrong VITE_API_URL, CORS block, offline, etc).
  if (!error?.response) {
    return "Can't reach the NEXUS server. Check your connection and try again.";
  }

  const { status, data } = error.response;
  const detail = data?.detail;

  switch (status) {
    case 400:
      return typeof detail === "string"
        ? detail
        : "That request couldn't be processed. Check your details and try again.";

    case 401:
      return context === "login"
        ? "Incorrect email or password."
        : "You need to sign in again.";

    case 409:
      return typeof detail === "string"
        ? detail
        : "An account with this email already exists.";

    case 422: {
      // FastAPI validation errors: { detail: [{ loc, msg, type }, ...] }
      if (Array.isArray(detail) && detail.length > 0) {
        return detail
          .map((d) => d.msg)
          .filter(Boolean)
          .join(" ");
      }
      return "Some of the details you entered aren't valid.";
    }

    case 500:
      return "Something went wrong on our end. Please try again shortly.";

    default:
      return typeof detail === "string"
        ? detail
        : "Something went wrong. Please try again.";
  }
}
