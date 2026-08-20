import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, LogOut, ShieldCheck, User } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import SettingsSection from "@/components/settings/SettingsSection";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/context/PreferencesContext";
import { useToast } from "@/context/ToastContext";

export default function Settings() {
  const { logout } = useAuth();
  const { reducedMotion, setReducedMotion } = usePreferences();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("You've been logged out.", "success");
    navigate("/login");
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-10"
      >
        <div className="border-b border-line pb-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-amber-500">
            Settings
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-100">
            Settings
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Manage your NEXUS account and preferences.
          </p>
        </div>

        <SettingsSection eyebrow="Security" title="Security">
          <Card className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="rounded-md border border-line-strong bg-surface p-2">
                <ShieldCheck className="h-4 w-4 text-verified" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-ink-100">Authentication</p>
                  <Badge tone="verified">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-500">
                  Your account is protected with JWT authentication.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-5">
              <div className="flex items-center gap-2 text-sm text-ink-300">
                <KeyRound className="h-4 w-4 text-ink-700" />
                Sign out of NEXUS on this device
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </Button>
            </div>
          </Card>
        </SettingsSection>

        <SettingsSection eyebrow="Application" title="Preferences">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink-100">Reduced motion</p>
                <p className="mt-1 text-sm text-ink-500">
                  Minimize animation throughout NEXUS. Stored only in this
                  browser — not synced to your account.
                </p>
              </div>
              <Switch
                checked={reducedMotion}
                onChange={setReducedMotion}
                label="Toggle reduced motion"
              />
            </div>
          </Card>
        </SettingsSection>

        <SettingsSection eyebrow="Danger zone" title="Danger zone">
          <Card variant="outline" className="border-red-500/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-red-400" />
                <div>
                  <p className="text-sm text-ink-100">Log out everywhere</p>
                  <p className="mt-1 text-sm text-ink-500">
                    End your current NEXUS session on this device.
                  </p>
                </div>
              </div>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </Button>
            </div>
          </Card>
        </SettingsSection>
      </motion.div>
    </PageContainer>
  );
}
