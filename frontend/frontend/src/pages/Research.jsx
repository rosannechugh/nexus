import { Search } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderPage from "@/components/ui/PlaceholderPage";

export default function Research() {
  return (
    <PageContainer>
      <PlaceholderPage
        icon={Search}
        title="Research"
        description="Start a new multi-agent research session or resume a previous one from the sidebar."
      />
    </PageContainer>
  );
}
