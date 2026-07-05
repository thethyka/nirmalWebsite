"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Heart } from "lucide-react";
import { Khanda } from "@/components/khanda";

export function Navigation() {
  const pathname = usePathname();

  if (pathname === "/gate") return null;

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/gallery", label: "Gallery", icon: Camera },
    { href: "/memories", label: "Memories", icon: Heart },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-border/70">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-ink font-serif text-lg md:text-2xl font-semibold tracking-wide min-w-0 flex-1 mr-2"
          >
            <Khanda className="w-7 h-7 md:w-8 md:h-8 text-gold shrink-0" />
            <span className="truncate min-w-0">Dr. Nirmal Singh Ahluwalia</span>
          </Link>

          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3.5 md:px-5 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  pathname === href
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-ink-soft hover:bg-secondary hover:text-primary"
                }`}
              >
                <Icon size={20} className="md:w-6 md:h-6" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
