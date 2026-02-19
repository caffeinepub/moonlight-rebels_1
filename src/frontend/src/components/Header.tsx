import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/generated/logo.dim_400x400.png" 
              alt="Moonlight Rebels" 
              className="h-10 w-10 rounded-full ring-2 ring-moonlight-500/50 group-hover:ring-rebel-500/50 transition-all"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-moonlight-400 to-rebel-400 bg-clip-text text-transparent">
              Moonlight Rebels
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground/80 hover:text-moonlight-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/partners" 
              className="text-sm font-medium text-foreground/80 hover:text-rebel-400 transition-colors"
            >
              Partners
            </Link>
            <Link 
              to="/admin" 
              className="text-sm font-medium text-foreground/80 hover:text-moonlight-400 transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LoginButton />
          </div>

          <button
            className="md:hidden p-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground/80 hover:text-moonlight-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/partners" 
              className="text-sm font-medium text-foreground/80 hover:text-rebel-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Partners
            </Link>
            <Link 
              to="/admin" 
              className="text-sm font-medium text-foreground/80 hover:text-moonlight-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="pt-2 border-t border-border/40">
              <LoginButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
