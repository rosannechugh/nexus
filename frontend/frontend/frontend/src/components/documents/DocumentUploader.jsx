import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileUp,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getErrorMessage } from "@/utils/getErrorMessage";

// idle -> selected -> uploading -> success | error
const STATES = {
  IDLE: "idle",
  SELECTED: "selected",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
};

function isPdf(file) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

/**
 * Reusable drag-and-drop PDF uploader. Owns its own state machine
 * (idle/selected/uploading/success/error) and calls the real
 * POST /api/documents/upload via the `uploadDocument` function passed
 * in (from useDocuments), so no Axios call lives inside this component.
 */
export default function DocumentUploader({ uploadDocument, onUploaded }) {
  const [state, setState] = useState(STATES.IDLE);
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [result, setResult] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

  const reset = () => {
    setState(STATES.IDLE);
    setFile(null);
    setValidationError("");
    setUploadError("");
    setResult(null);
  };

  const handleFile = (selected) => {
    if (!selected) return;
    if (!isPdf(selected)) {
      setValidationError("Only PDF files are supported.");
      setFile(null);
      setState(STATES.IDLE);
      return;
    }
    setValidationError("");
    setFile(selected);
    setState(STATES.SELECTED);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setState(STATES.UPLOADING);
    setUploadError("");
    try {
      const data = await uploadDocument(file);
      setResult(data);
      setState(STATES.SUCCESS);
      onUploaded?.(data);
    } catch (err) {
      setUploadError(getErrorMessage(err, "The upload failed. Please try again."));
      setState(STATES.ERROR);
    }
  };

  if (state === STATES.SUCCESS && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start gap-3 rounded-lg border border-verified/30 bg-verified/5 px-5 py-6"
      >
        <CheckCircle2 className="h-5 w-5 text-verified" />
        <div>
          <p className="font-display text-sm font-medium text-ink-100">
            Document uploaded successfully.
          </p>
          <dl className="mt-2 flex flex-col gap-1 text-xs text-ink-500">
            {result.filename && (
              <div className="flex gap-1.5">
                <dt className="text-ink-700">Filename:</dt>
                <dd className="truncate text-ink-300">{result.filename}</dd>
              </div>
            )}
            {typeof result.pages === "number" && (
              <div className="flex gap-1.5">
                <dt className="text-ink-700">Pages:</dt>
                <dd className="text-ink-300">{result.pages}</dd>
              </div>
            )}
            {typeof result.chunks === "number" && (
              <div className="flex gap-1.5">
                <dt className="text-ink-700">Chunks:</dt>
                <dd className="text-ink-300">{result.chunks}</dd>
              </div>
            )}
            {result.status && (
              <div className="flex gap-1.5">
                <dt className="text-ink-700">Status:</dt>
                <dd className="text-ink-300">{result.status}</dd>
              </div>
            )}
          </dl>
        </div>
        <Button size="sm" variant="secondary" onClick={reset}>
          Upload another
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center transition-colors ${
          isDragActive
            ? "border-amber-500/60 bg-amber-950/10"
            : "border-line-strong bg-surface"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleInputChange}
          className="sr-only"
          aria-label="Upload a PDF research paper"
        />

        <div className="rounded-md border border-line-strong bg-surface-raised p-3">
          <UploadCloud className="h-5 w-5 text-amber-400" />
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-300">
            Drop your research paper
          </p>
          <p className="mt-1 text-sm text-ink-500">Drag &amp; drop a PDF here</p>
        </div>

        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
          or
        </span>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <FileUp className="h-3.5 w-3.5" />
          Choose PDF
        </Button>

        <p className="text-xs text-ink-700">PDF files only</p>
      </div>

      {validationError && (
        <div className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {validationError}
        </div>
      )}

      {(state === STATES.SELECTED || state === STATES.UPLOADING || state === STATES.ERROR) &&
        file && (
          <div className="flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3">
            <FileUp className="h-4 w-4 shrink-0 text-ink-500" />
            <span className="min-w-0 flex-1 truncate text-sm text-ink-100" title={file.name}>
              {file.name}
            </span>
            {state !== STATES.UPLOADING && (
              <button
                type="button"
                onClick={reset}
                aria-label="Remove selected file"
                className="text-ink-700 hover:text-ink-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

      {uploadError && (
        <div className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {uploadError}
        </div>
      )}

      {(state === STATES.SELECTED || state === STATES.UPLOADING || state === STATES.ERROR) &&
        file && (
          <Button onClick={handleUpload} disabled={state === STATES.UPLOADING}>
            {state === STATES.UPLOADING ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading and indexing…
              </>
            ) : state === STATES.ERROR ? (
              "Try again"
            ) : (
              "Upload"
            )}
          </Button>
        )}
    </div>
  );
}
