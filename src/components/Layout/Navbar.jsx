import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { logout, getCurrentUser } from '../../services/auth';

const Navbar = () => {
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-semibold">
              Banking App
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 