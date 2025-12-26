// app/page.tsx
import ModelViewerLoader from "@/components/ModelViewerLoader";
import PortfolioPageClient from "@/components/PortfolioPageClient";

export default function Page() {
  return (
    <>
      {/* loads <model-viewer> web component once */}
      <ModelViewerLoader />
      {/* renders your HTML + runs your existing JS in client */}
      <PortfolioPageClient />
    </>
  );
}
