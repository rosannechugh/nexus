import { Settings as SettingsIcon } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderPage from "@/components/ui/PlaceholderPage";

export default function Settings() {
  return (
    <PageContainer>
      <PlaceholderPage
        icon={SettingsIcon}
        title="Settings"
        description="Manage your account, API preferences, and agent configuration here."
      />
    </PageContainer>
  );
}
