"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-slate-900 font-polymath">
              ReconcileIt
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-slate-700 hover:text-slate-900 px-3 py-2 text-md font-bold font-polymath"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-slate-700 hover:text-slate-900 px-3 py-2 text-md font-bold font-polymath"
              >
                About
              </Link>
              <Link
                href="/features"
                className="text-slate-700 hover:text-slate-900 px-3 py-2 text-md font-bold font-polymath"
              >
                Features
              </Link>
              <Link
                href="/contact"
                className="text-slate-700 hover:text-slate-900 px-3 py-2 text-md font-bold font-polymath"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="font-polymath text-md font-bold">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#90e39a] text-slate-900 hover:bg-[#90e39a]/80 font-polymath text-md font-bold">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;