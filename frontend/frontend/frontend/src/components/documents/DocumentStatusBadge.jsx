import Badge from "@/components/ui/Badge";

// Backend only ever sets "ready" or "failed" today (indexing happens
// synchronously in the upload request) — "processing" is included so the
// badge styles correctly if the data model adds an async path later, but
// none of these are fabricated: whatever string the backend returns is
// what's shown.
const STATUS_TONE = {
  ready: "verified",
  processing: "amber",
  failed: "danger",
};

export default function DocumentStatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  const tone = STATUS_TONE[normalized] || "neutral";
  return <Badge tone={tone}>{status || "Unknown"}</Badge>;
}
