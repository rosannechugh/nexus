import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import StatsOverview from "@/components/dashboard/StatsOverview";
import RecentResearchList from "@/components/dashboard/RecentResearchList";
import LiteratureLibraryPreview from "@/components/dashboard/LiteratureLibraryPreview";
import NewResearchModal from "@/components/research/NewResearchModal";
import { useAuth } from "@/hooks/useAuth";
import { useResearchSessionsContext } from "@/context/ResearchSessionsContext";
import { useDocuments } from "@/hooks/useDocuments";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    sessions,
    isLoading: sessionsLoading,
    error: sessionsError,
    createSession,
  } = useResearchSessionsContext();

  const {
    documents,
    isLoading: documentsLoading,
    error: documentsError,
  } = useDocuments();

  const latestSession = sessions[0];

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-10"
      >
        <DashboardHeader
          name={user?.name?.split(" ")[0]}
          onNewResearch={() => setModalOpen(true)}
          onUploadPaper={() => navigate("/documents")}
        />

        <QuickActions
          onNewResearch={() => setModalOpen(true)}
          onOpenLibrary={() => navigate("/documents")}
          latestSession={!sessionsLoading ? latestSession : null}
          onContinueResearch={() =>
            latestSession && navigate(`/research/${latestSession.id}`)
          }
        />

        <StatsOverview
          sessionsCount={sessions.length}
          documentsCount={documents.length}
          isLoading={sessionsLoading || documentsLoading}
        />

        <RecentResearchList
          sessions={sessions.slice(0, 5)}
          isLoading={sessionsLoading}
          error={sessionsError}
          onStartResearch={() => setModalOpen(true)}
        />

        <LiteratureLibraryPreview
          documents={documents.slice(0, 5)}
          isLoading={documentsLoading}
          error={documentsError}
        />
      </motion.div>

      <NewResearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateSession={createSession}
      />
    </PageContainer>
  );
}
