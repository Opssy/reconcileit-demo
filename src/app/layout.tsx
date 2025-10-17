import type { Metadata } from "next";
import { QueryProvider } from "./providers/query-client-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReconcileIt - Financial Reconciliation System",
  description: "Streamline your financial workflows with intelligent automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Polymath';
              src: url('https://cdn.jsdelivr.net/gh/webfonts/polymath/Polymath-Regular.woff2') format('woff2'),
                   url('https://cdn.jsdelivr.net/gh/webfonts/polymath/Polymath-Regular.woff') format('woff');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            :root {
              --font-polymath: 'Polymath', sans-serif;
              --font-inter: 'Inter', sans-serif;
              --font-mono: 'JetBrains Mono', monospace;
            }
          `
        }} />
      </head>
      <body
        className="font-sans antialiased"
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
