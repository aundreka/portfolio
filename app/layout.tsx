// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aundreka Perez - Portfolio",
  description: "Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap"
          rel="stylesheet"
        />

        {/* Your existing CSS (served from /public/css) */}
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/entrance.css" />
        <link rel="stylesheet" href="/css/about.css" />
        <link rel="stylesheet" href="/css/projects.css" />
      </head>

      <body>{children}</body>
    </html>
  );
}
