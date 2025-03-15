import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Menu, 
  X, 
  User, 
  Calendar,
  UserCircle
} from "lucide-react";
import { getCurrentUser, signOut } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

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
  const [isOpen, setIsOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/logo.svg" alt="Hotel Viewmont" className="h-10" />
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-semibold text-[#722F37]">Hotel Viewmont</span>
            <span className="text-xs text-muted-foreground">Hotel & Restaurant</span>
          </div>
        </Link>

        {/* Mobile menu button */}
        <Button
          variant="outline"
          className="md:hidden hover:bg-transparent hover:border-[#722F37] hover:text-[#722F37]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground/60 hover:text-[#722F37] transition">
            Home
          </Link>
          <Link to="/rooms" className="text-foreground/60 hover:text-[#722F37] transition">
            Rooms
          </Link>
          <Link to="/gallery" className="text-foreground/60 hover:text-[#722F37] transition">
            Gallery
          </Link>
          <Link to="/about" className="text-foreground/60 hover:text-[#722F37] transition">
            About
          </Link>
          <Link to="/contact" className="text-foreground/60 hover:text-[#722F37] transition">
            Contact
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative hover:bg-transparent hover:border-[#722F37] hover:text-[#722F37]">
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="bg-[#722F37] text-white hover:bg-transparent hover:text-[#722F37] hover:border-[#722F37] transition-colors"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link
                to="/"
                className="text-foreground/60 hover:text-foreground transition"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className="text-foreground/60 hover:text-foreground transition"
                onClick={() => setIsOpen(false)}
              >
                Rooms
              </Link>
              <Link
                to="/gallery"
                className="text-foreground/60 hover:text-foreground transition"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link
                to="/about"
                className="text-foreground/60 hover:text-foreground transition"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-foreground/60 hover:text-foreground transition"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              {user ? (
                <>
                  <Link
                    to="/my-bookings"
                    className="text-foreground/60 hover:text-foreground transition"
                    onClick={() => setIsOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    className="text-foreground/60 hover:text-foreground transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start px-2"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
