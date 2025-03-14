
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarClock, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  Home 
} from 'lucide-react';

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Rooms', href: '/admin/rooms', icon: BedDouble },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarClock },
    { name: 'Guests', href: '/admin/guests', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Desktop Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out hidden md:block ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${className}`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">H</span>
                </div>
                <span className="font-medium tracking-wide">Hotelviewmont</span>
              </Link>
            )}
            
            {isCollapsed && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">H</span>
              </div>
            )}
            
            {!isCollapsed && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {/* Navigation */}
          <ScrollArea className="flex-1 py-2">
            <nav className="px-2 space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center' : 'justify-start'
                    } px-3 py-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <Link to="/">
              <Button 
                variant="outline" 
                className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
              >
                <Home className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && <span>View Website</span>}
              </Button>
            </Link>
            
            <Link to="/login">
              <Button 
                variant="ghost" 
                className={`w-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10 ${
                  isCollapsed ? 'justify-center px-2' : 'justify-start'
                }`}
              >
                <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </Link>
          </div>
          
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="m-2 hidden md:flex"
            onClick={toggleSidebar}
          >
            {isCollapsed ? "Expand" : "Collapse"}
          </Button>
        </div>
      </aside>
      
      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileSidebar}
          />
          
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 h-full w-64 z-50 bg-white dark:bg-gray-900 shadow-xl animate-slide-right">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
                <Link to="/admin" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">H</span>
                  </div>
                  <span className="font-medium tracking-wide">Admin Panel</span>
                </Link>
                
                <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Navigation */}
              <ScrollArea className="flex-1 py-2">
                <nav className="px-2 space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={toggleMobileSidebar}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </ScrollArea>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <Link to="/" onClick={toggleMobileSidebar}>
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="h-5 w-5 mr-2" />
                    <span>View Website</span>
                  </Button>
                </Link>
                
                <Link to="/login" onClick={toggleMobileSidebar}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
