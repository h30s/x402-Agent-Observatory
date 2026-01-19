import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "x402 Observatory | Cronos Agentic Economy Control Tower",
  description: "Real-time indexing, visualization, and search for all x402 agent activity on Cronos blockchain",
  keywords: ["x402", "cronos", "blockchain", "agents", "mcp", "observatory", "crypto"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} flex h-screen overflow-hidden bg-[var(--bg-app)]`}>
        {/* Icon Rail Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 relative overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
