import { ReactNode } from "react";
import { Link } from "wouter";
import { Gift } from "lucide-react";
import iconImage from "@assets/generated_images/gift_box_icon_illustration.png";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-300">
                 <img src={iconImage} alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <span className="font-display text-2xl text-primary font-bold tracking-tight">GiftGiver</span>
            </a>
          </Link>
          
          <nav className="flex gap-4 items-center">
            <button className="text-sm font-medium hover:text-primary transition-colors">
              Log In
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
              Get Started
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-8 mt-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 GiftGiver. Spread the joy.</p>
        </div>
      </footer>
    </div>
  );
}
