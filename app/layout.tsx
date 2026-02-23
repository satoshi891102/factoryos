import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "FactoryOS — App Factory Control Panel",
  description: "Real-time dashboard for the Basirah App Factory pipeline. Monitor builds, gate scores, deployments, and revenue.",
  openGraph: {
    title: "FactoryOS — App Factory Control Panel",
    description: "Your agent's production line, visualized.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Nav />
        <main className="pt-16 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
