import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import iconImage from "@assets/generated_images/fincred_finance_logo_icon.png";
import { ShieldCheck, HelpCircle } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <span className="font-display text-xl text-primary font-bold tracking-tight">FINCRED</span>
            </a>
          </Link>
          
          <nav className="flex gap-4 items-center">
            <Link href="/guide">
              <a className={`text-sm font-medium transition-colors flex items-center gap-1 ${location === '/guide' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}>
                <HelpCircle className="w-4 h-4" /> Help Guide
              </a>
            </Link>
            <Link href="/admin">
              <a className={`text-sm font-medium transition-colors flex items-center gap-1 ${location === '/admin' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}>
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </a>
            </Link>
            <button className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
              Portal Login
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 bg-slate-50/50">
        {children}
      </main>

      <footer className="border-t py-8 mt-12 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Fincred Finance. Internal Use Only.</p>
        </div>
      </footer>
    </div>
  );
}
