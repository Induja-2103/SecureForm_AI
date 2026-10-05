import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

import { Providers } from "@/components/Providers";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "CyberShield AI | Cybersecurity Defense & Autonomous Form Intelligence",
  description: "Autonomous cybersecurity defense, intelligent form automation, risk scanning, and Gmail tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
