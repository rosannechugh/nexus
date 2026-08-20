import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, SearchX } from "lucide-react";
import ResearchSidebar from "@/components/research/ResearchSidebar";
import ResearchChat from "@/components/chat/ResearchChat";
import EvidencePanel from "@/components/research/EvidencePanel";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useResearchSession } from "@/hooks/useResearchSession";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/context/ToastContext";
import api from "@/services/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ResearchSession() {
  const { sessionId } = useParams();
  const {
    session,
    messages,
    isLoading,
    error,
    notFound,
    appendMessage,
    refetch,
  } = useResearchSession(sessionId);
  const { documents } = useDocuments();
  const { showToast } = useToast();

  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(null);
  const [activeEvidenceMessageId, setActiveEvidenceMessageId] = useState(null);
  const [sessionsMobileOpen, setSessionsMobileOpen] = useState(false);
  const [evidenceMobileOpen, setEvidenceMobileOpen] = useState(false);
  const [evidenceCollapsed, setEvidenceCollapsed] = useState(false);

  // Reset per-session UI state when switching sessions.
  useEffect(() => {
    setSendError(null);
    setSelectedSourceIndex(null);
    setActiveEvidenceMessageId(null);
  }, [sessionId]);

  const documentsById = useMemo(
    () =>
      documents.reduce((acc, doc) => {
        acc[doc.id] = doc;
        return acc;
      }, {}),
    [documents]
  );

  const sendQuery = async (query) => {
    setSendError(null);
    setIsSending(true);
    try {
      const { data } = await api.post("/api/chat", {
        session_id: Number(sessionId),
        query,
        top_k: 5,
      });
      appendMessage({
        id: `local-assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        createdAt: new Date().toISOString(),
        metadata: {
          reasoning: data.reasoning,
          sources: data.sources,
          verification: data.verification,
          query_type: data.query_type,
        },
      });
      setSelectedSourceIndex(null);
      // A fresh response supersedes whatever the evidence panel was
      // pinned to — follow the newest answer's evidence automatically.
      setActiveEvidenceMessageId(null);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "NEXUS couldn't complete this research request."
      );
      setSendError({ message, query });
      showToast(message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = (query) => {
    appendMessage({
      id: `local-user-${Date.now()}`,
      role: "user",
      content: query,
      createdAt: new Date().toISOString(),
      metadata: null,
    });
    sendQuery(query);
  };

  const handleRetry = () => {
    if (sendError) sendQuery(sendError.query);
  };

  const latestWithEvidence = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.metadata?.sources?.length);
  const evidenceMessage = activeEvidenceMessageId
    ? messages.find((m) => m.id === activeEvidenceMessageId)
    : latestWithEvidence;
  const sources = evidenceMessage?.metadata?.sources || [];
  const verification = evidenceMessage?.metadata?.verification || [];
  const hasEvidence = sources.length > 0;

  const isDesktopViewport = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches;

  const handleViewEvidence = (messageId) => {
    setActiveEvidenceMessageId(messageId);
    setSelectedSourceIndex(null);
    if (isDesktopViewport()) {
      setEvidenceCollapsed(false);
    } else {
      setEvidenceMobileOpen(true);
    }
  };

  if (notFound) {
    return (
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <ResearchSidebar
          activeSessionId={sessionId}
          mobileOpen={sessionsMobileOpen}
          onCloseMobile={() => setSessionsMobileOpen(false)}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <SearchX className="h-6 w-6 text-ink-700" />
          <h1 className="font-display text-lg font-medium text-ink-100">
            Research session not found
          </h1>
          <p className="max-w-sm text-sm text-ink-500">
            This session doesn&apos;t exist, or doesn&apos;t belong to your
            account.
          </p>
          <Link to="/research">
            <Button variant="secondary" size="sm">
              Back to Research
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <ResearchSidebar
          activeSessionId={sessionId}
          mobileOpen={sessionsMobileOpen}
          onCloseMobile={() => setSessionsMobileOpen(false)}
        />
        <div className="flex flex-1 flex-col">
          <div className="flex h-[65px] items-center border-b border-line px-6">
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-6 py-6">
            <Skeleton className="h-20 w-2/3 self-end" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-16 w-3/4 self-end" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <ResearchSidebar
          activeSessionId={sessionId}
          mobileOpen={sessionsMobileOpen}
          onCloseMobile={() => setSessionsMobileOpen(false)}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <p className="max-w-sm text-sm text-red-400">{error}</p>
          <Button variant="secondary" size="sm" onClick={refetch}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ResearchSidebar
        activeSessionId={sessionId}
        mobileOpen={sessionsMobileOpen}
        onCloseMobile={() => setSessionsMobileOpen(false)}
      />

      <ResearchChat
        title={session?.title || "Research Session"}
        updatedAt={session?.updatedAt}
        messages={messages}
        isSending={isSending}
        sendError={sendError}
        onSend={handleSend}
        onRetry={handleRetry}
        onToggleSessions={() => setSessionsMobileOpen(true)}
        onToggleEvidence={() => {
          if (isDesktopViewport()) {
            setEvidenceCollapsed((v) => !v);
          } else {
            setEvidenceMobileOpen(true);
          }
        }}
        onViewEvidence={handleViewEvidence}
        hasEvidence={hasEvidence || isSending}
      />

      {!evidenceCollapsed && (
        <EvidencePanel
          sources={sources}
          verification={verification}
          documentsById={documentsById}
          selectedIndex={selectedSourceIndex}
          onSelectIndex={setSelectedSourceIndex}
          mobileOpen={evidenceMobileOpen}
          onCloseMobile={() => setEvidenceMobileOpen(false)}
          isLoading={isSending}
          loadError={Boolean(sendError) && !hasEvidence}
        />
      )}
    </div>
  );
}
