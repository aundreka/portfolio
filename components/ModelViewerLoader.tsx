// components/ModelViewerLoader.tsx
"use client";

import Script from "next/script";

export default function ModelViewerLoader() {
  return (
    <Script
      type="module"
      src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      strategy="afterInteractive"
    />
  );
}
