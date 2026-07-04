"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Heart, MapPin } from "lucide-react";
import { isServiceVisible } from "@/lib/service-visibility";

export function Navigation() {
  const pathname = usePathname();

  if (pathname === "/gate") return null;

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    ...(isServiceVisible() ? [{ href: "/service", label: "Service", icon: MapPin }] : []),
    { href: "/gallery", label: "Gallery", icon: Camera },
    { href: "/memories", label: "Memories", icon: Heart },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-purple-600 font-bold text-xl">
            Dr. Nirmal Singh Ahluwalia
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  pathname === href
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-purple-600 hover:bg-white/30"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
