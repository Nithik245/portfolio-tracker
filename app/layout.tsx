import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Globe,
  LineChart,
} from "lucide-react";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio Tracker",
  description: "Personal investment portfolio tracker",
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/holdings", label: "Holdings", icon: Briefcase },
  { href: "/fundamentals", label: "Fundamentals", icon: BarChart2 },
  { href: "/macro", label: "Macro", icon: Globe },
  { href: "/charts", label: "Charts", icon: LineChart },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <div className="flex h-screen bg-[#0D1B2A] text-white">
          <aside className="w-56 bg-[#1B3A5C] flex flex-col py-6 px-4 shrink-0">
            <h1 className="text-lg font-bold text-white mb-8 px-2">
              Portfolio Tracker
            </h1>
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-[#2E86AB] hover:text-white transition-colors"
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="h-14 bg-[#1B3A5C] border-b border-[#2E86AB] flex items-center px-6 shrink-0">
              <span className="text-sm text-gray-400">
                Portfolio Tracker — Investment Dashboard
              </span>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
