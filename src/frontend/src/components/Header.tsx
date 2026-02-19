import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useState } from 'react';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/Logo.jpg" 
            alt="ML Enterprise Logo" 
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">ML Enterprise</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Mokokchung Courier Service</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </button>
          <button onClick={() => scrollToSection('partners')} className="text-sm font-medium hover:text-primary transition-colors">
            Partners
          </button>
          <button onClick={() => scrollToSection('booking')} className="text-sm font-medium hover:text-primary transition-colors">
            Book Now
          </button>
          <button onClick={() => scrollToSection('tracking')} className="text-sm font-medium hover:text-primary transition-colors">
            Track Parcel
          </button>
          <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && userProfile && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {userProfile.name}
            </span>
          )}
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {disabled ? 'Loading...' : isAuthenticated ? 'Logout' : 'Admin Login'}
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col gap-4 py-4">
            <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-primary transition-colors text-left">
              Services
            </button>
            <button onClick={() => scrollToSection('partners')} className="text-sm font-medium hover:text-primary transition-colors text-left">
              Partners
            </button>
            <button onClick={() => scrollToSection('booking')} className="text-sm font-medium hover:text-primary transition-colors text-left">
              Book Now
            </button>
            <button onClick={() => scrollToSection('tracking')} className="text-sm font-medium hover:text-primary transition-colors text-left">
              Track Parcel
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:text-primary transition-colors text-left">
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
