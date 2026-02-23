"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Factory, BarChart3, DollarSign, Settings, Gauge } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Factory },
  { href: "/gates", label: "Gates", icon: Gauge },
  { href: "/revenue", label: "Revenue", icon: DollarSign },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-bg-primary/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Factory className="w-4 h-4 text-gold" />
          </div>
          <span className="text-lg font-semibold text-text-primary">
            Factory<span className="text-gold">OS</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-text-muted hover:text-text-secondary hover:bg-bg-card"
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
