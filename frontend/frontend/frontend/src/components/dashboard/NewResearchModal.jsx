import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getErrorMessage } from "@/utils/getErrorMessage";

/**
 * Creates a real research session via POST /api/research/sessions (through
 * the shared createSession action from ResearchSessionsContext) and routes
 * to the new session on success. No local-only/fake session state.
 */
export default function NewResearchModal({ open, onClose, onCreateSession }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setTitle("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Give your research a title to get started.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const session = await onCreateSession(trimmed);
      setTitle("");
      onClose();
      navigate(`/research/${session.id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't create that research session."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Start a new research">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="research-title"
            className="mb-1.5 block text-sm text-ink-500"
          >
            Research title
          </label>
          <Input
            id="research-title"
            autoFocus
            value={title}
            onChange={(e) => {
              setError("");
              setTitle(e.target.value);
            }}
            placeholder="e.g. Parkinson's Disease Literature Review"
            maxLength={255}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-1 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create Research"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
