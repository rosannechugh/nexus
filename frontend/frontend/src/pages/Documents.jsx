import { FileText } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderPage from "@/components/ui/PlaceholderPage";

export default function Documents() {
  return (
    <PageContainer>
      <PlaceholderPage
        icon={FileText}
        title="Documents"
        description="Upload, browse, and manage the documents NEXUS indexes for retrieval-augmented research."
      />
    </PageContainer>
  );
}
