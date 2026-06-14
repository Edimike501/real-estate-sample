"use client";

import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import { Menu, X, Bookmark } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import SavedPropertiesDrawer from "@/components/property/SavedPropertiesDrawer";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { count, isInitialized } = useBookmarks();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Services", href: "/#services" },
    { label: "Packages", href: "/#packages" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-bg-primary/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo href="/" width={40} height={40} showText={true} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-accent transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side: Bookmark + Theme Toggle + Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Saved Properties Bookmark Trigger */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative p-2 rounded-lg border border-border hover:border-accent hover:bg-bg-secondary transition-colors cursor-pointer text-text-secondary hover:text-accent"
                aria-label="View saved properties"
              >
                <Bookmark className="w-5 h-5" />
                {isInitialized && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm">
                    {count}
                  </span>
                )}
              </button>

              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg border border-border hover:border-accent transition-colors"
                aria-label="Toggle menu">
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-text-primary" />
                ) : (
                  <Menu className="w-5 h-5 text-text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Saved Properties Drawer */}
      <SavedPropertiesDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-bg-primary border-b border-border md:hidden">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
