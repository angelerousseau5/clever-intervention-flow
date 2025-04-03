
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">InterFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <Link to="/intervention">
              <Button>Nouvelle Intervention</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Inscription</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="sm:hidden animate-slide-in">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/intervention"
              className="block py-2 text-primary font-medium"
            >
              Nouvelle Intervention
            </Link>
            <Link to="/login" className="block py-2 text-gray-600">
              Connexion
            </Link>
            <Link to="/register" className="block py-2 text-gray-600">
              Inscription
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
