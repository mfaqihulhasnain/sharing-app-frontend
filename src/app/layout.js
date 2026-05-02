import { Geist, Geist_Mono } from "next/font/google";
import { AppPresenceProvider } from "@/components/presence/app-presence-provider";
import { AppToaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sharing Board",
  description: "A polished local network board for quick text and file sharing.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AppPresenceProvider>{children}</AppPresenceProvider>
        <AppToaster />
      </body>
    </html>
  );
}
