import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Hotel Viewmont" className="h-12" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Experience the perfect blend of luxury accommodation and fine dining at Hotel Viewmont. Your memorable stay awaits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[#722F37]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/rooms" className="text-sm text-muted-foreground hover:text-[#722F37] transition">
                  Our Rooms
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-muted-foreground hover:text-[#722F37] transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-[#722F37] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-[#722F37] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-[#722F37]">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-[#722F37] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-[#722F37] transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-[#722F37] transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-[#722F37]">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                19 Apex Dr
              </li>
              <li className="text-sm text-muted-foreground">
                Logan Lake, BC V0K 1W0
              </li>
              <li className="text-sm text-muted-foreground">
                +1 (250) 299-9019
              </li>
              <li className="text-sm text-muted-foreground">
                viewmonthotel@gmail.com
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-[#722F37] transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-[#722F37] transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-[#722F37] transition">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hotel Viewmont. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
