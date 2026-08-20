import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import WorkspacePreview from "@/components/landing/WorkspacePreview";
import DocumentIntelligence from "@/components/landing/DocumentIntelligence";
import WhyNexus from "@/components/landing/WhyNexus";
import FinalCTA from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <WorkspacePreview />
      <DocumentIntelligence />
      <WhyNexus />
      <FinalCTA />
    </>
  );
}
