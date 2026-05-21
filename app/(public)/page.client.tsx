"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { ROLE_REDIRECTS, DEFAULT_AUTH_REDIRECT } from "@/constants/routes.constant";

// Minimal B2B Branding for AIML System

export const PageClient = () => {
  const { user } = useAuth();
  const { role } = useRole();

  const redirectPath = role
    ? (ROLE_REDIRECTS[role] ?? DEFAULT_AUTH_REDIRECT)
    : DEFAULT_AUTH_REDIRECT;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-mono text-sm uppercase tracking-tight">AIML System</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 text-sm">
              {user ? (
                <Link href={redirectPath}>
                  <div className="flex h-9 items-center px-4 text-sm font-medium">Enter App</div>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    Login
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
            <ModeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Operational
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            AI-driven Marketing Loop for Bio/Pharma
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Continuous content creation, regulatory-aware review cycles, and automated distribution
            infrastructure for global visibility.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? redirectPath : "/register"}>
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium">
                {user ? "Enter App" : "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-10">
        <div className="max-w-2xl mx-auto px-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} AIML System</span>
            <Link href="/privacy" className="hover:text-foreground transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition">
              Terms
            </Link>
          </div>
          <Link
            href="https://github.com/alpacaPwaa/aiml-poc.git"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition flex items-center gap-1"
          >
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  );
};
