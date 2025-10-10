import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import Layout from "../../components/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({ children }) {
  // Do not render <html> or <body> here — the root layout owns them.
  // Keep the font variables on the root layout; this file should only
  // wrap pages with the dashboard Layout component.
  return <Layout>{children}</Layout>;
}
