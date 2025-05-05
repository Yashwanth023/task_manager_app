
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Bell, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationList } from "@/components/notifications/NotificationList";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin, isManager } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "U";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-secondary sticky top-0 z-50 w-full border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gradient-primary">TaskFlow</h1>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/tasks"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Tasks
                </Link>
                
                {isManager() && (
                  <Link
                    to="/team"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Team
                  </Link>
                )}

                {isAdmin() && (
                  <Link
                    to="/audit-logs"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Audit Logs
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <NotificationDropdown unreadCount={unreadCount} />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs opacity-70">
                      {user.email}
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer w-full">
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notification Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="secondary">
                  <Link to="/login">Log In</Link>
                </Button>
                
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {user && (
              <NotificationDropdown unreadCount={unreadCount} className="mr-2" />
            )}
            
            <Button variant="ghost" onClick={toggleMobileMenu} size="icon">
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={toggleMobileMenu}
            >
              Dashboard
            </Link>
            
            <Link
              to="/tasks"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={toggleMobileMenu}
            >
              Tasks
            </Link>
            
            {isManager() && (
              <Link
                to="/team"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={toggleMobileMenu}
              >
                Team
              </Link>
            )}
            
            {isAdmin() && (
              <Link
                to="/audit-logs"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={toggleMobileMenu}
              >
                Audit Logs
              </Link>
            )}
          </div>

          {user ? (
            <div className="pt-4 pb-3 border-t border-border">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="ml-3">
                  <div className="text-base font-medium">{user.name}</div>
                  <div className="text-sm opacity-70">{user.email}</div>
                </div>
              </div>
              
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMobileMenu}
                >
                  Notification Settings
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-border px-5 flex flex-col space-y-2">
              <Button asChild variant="secondary" onClick={toggleMobileMenu}>
                <Link to="/login">Log In</Link>
              </Button>
              
              <Button asChild onClick={toggleMobileMenu}>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

interface NotificationDropdownProps {
  unreadCount: number;
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  unreadCount, 
  className = "" 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NotificationList />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Navbar;
