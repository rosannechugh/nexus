import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  FileText,
  LogOut,
  Search,
  Settings as SettingsIcon,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useResearchSessionsContext } from "@/context/ResearchSessionsContext";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/context/ToastContext";

function Field({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
        {label}
      </p>
      <p className="mt-1 text-sm text-ink-100">{value}</p>
    </div>
  );
}

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const { sessions, isLoading: sessionsLoading } = useResearchSessionsContext();
  const { documents, isLoading: documentsLoading } = useDocuments();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("You've been logged out.", "success");
    navigate("/login");
  };

  // In normal use ProtectedRoute already guarantees a resolved, non-null
  // user before this page can render — these two branches exist as a
  // genuine defensive fallback (e.g. a token that expires mid-session),
  // not decoration.
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <div className="flex flex-col items-start gap-3 py-10">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-sm text-red-400">Unable to load your profile.</p>
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-8"
      >
        <div className="border-b border-line pb-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-amber-500">
            Profile
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-100">
            Profile
          </h1>
          <p className="mt-2 text-sm text-ink-500">Your NEXUS account.</p>
        </div>

        <Card className="mx-auto flex w-full max-w-md flex-col items-center gap-3 py-10 text-center">
          <Avatar name={user.name} size="lg" />
          <div>
            <p className="font-display text-lg font-medium text-ink-100">
              {user.name}
            </p>
            <p className="mt-0.5 text-sm text-ink-500">{user.email}</p>
          </div>
        </Card>

        <section className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
              Account
            </p>
            <h2 className="mt-1 font-display text-base font-medium tracking-tight text-ink-100">
              Account information
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Read-only — NEXUS doesn&apos;t yet support editing profile
              details from the app.
            </p>
          </div>
          <Card className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Full Name" value={user.name} />
            <Field label="Email Address" value={user.email} />
            <Field label="User ID" value={user.id} />
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
            Overview
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex items-center gap-3">
              <div className="rounded-md border border-line-strong bg-surface p-2">
                <Search className="h-4 w-4 text-ink-300" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-ink-100">
                  {sessionsLoading ? (
                    <Skeleton className="h-5 w-6" />
                  ) : (
                    sessions.length
                  )}
                </p>
                <p className="text-xs text-ink-500">Research Sessions</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3">
              <div className="rounded-md border border-line-strong bg-surface p-2">
                <FileText className="h-4 w-4 text-ink-300" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-ink-100">
                  {documentsLoading ? (
                    <Skeleton className="h-5 w-6" />
                  ) : (
                    documents.length
                  )}
                </p>
                <p className="text-xs text-ink-500">Documents</p>
              </div>
            </Card>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Link to="/settings">
            <Button variant="secondary" size="sm">
              <SettingsIcon className="h-3.5 w-3.5" />
              Go to Settings
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </motion.div>
    </PageContainer>
  );
}
