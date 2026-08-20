import { useParams } from "react-router-dom";
import { MessagesSquare } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderPage from "@/components/ui/PlaceholderPage";

export default function ResearchSession() {
  const { sessionId } = useParams();

  return (
    <PageContainer>
      <PlaceholderPage
        icon={MessagesSquare}
        title={`Research session ${sessionId}`}
        description="The agent workspace — planner, retrieval, synthesis, and verification steps — will be rendered here."
      />
    </PageContainer>
  );
}
