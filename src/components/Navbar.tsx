import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Menu, 
  X, 
  User, 
  Calendar 
} from "lucide-react";
import { getCurrentUser, signOut } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface NavLink {
  name: string;
  href: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navLinks: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-800 shadow-sm"
          : "bg-slate-900"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-medium text-lg transition-opacity duration-200 hover:opacity-80"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">H</span>
            </div>
            <span className="font-medium tracking-wide text-white">
              Hotelviewmont
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`py-2 text-sm font-medium transition-colors duration-200
                  ${
                    location.pathname === link.href
                      ? "text-white border-b-2 border-primary"
                      : "text-gray-300 hover:text-white"
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <Button variant="outline" disabled>Loading...</Button>
            ) : user ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/my-bookings')}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Calendar className="mr-1 h-4 w-4" />
                  My Bookings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <User className="bg-primary hover:bg-primary/90 text-white" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 shadow-lg animate-slide-down">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-3 py-4 text-base font-medium transition-colors duration-200 border-b border-slate-700
                  ${
                    location.pathname === link.href
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 pb-6">
              {isLoading ? (
                <Button variant="outline" disabled>Loading...</Button>
              ) : user ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-white/30 text-white"
                    onClick={() => {
                      navigate('/my-bookings');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Calendar className="mr-1 h-4 w-4" />
                    My Bookings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-white/30 text-white"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center border-white/30 text-white">
                      <User className="mr-1 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
