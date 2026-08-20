import { LayoutDashboard } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderPage from "@/components/ui/PlaceholderPage";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PlaceholderPage
        icon={LayoutDashboard}
        title={
          user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Dashboard"
        }
        description="An overview of your research sessions, documents, and recent activity will live here."
      />
    </PageContainer>
  );
}
