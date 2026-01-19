import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({
  subsets: ["latin"],
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
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex min-h-screen relative z-10">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-64">
            <Header />
            <main className="flex-1 p-6 pt-20">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
