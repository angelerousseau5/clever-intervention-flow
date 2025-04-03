
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, FileText, Plus, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Mock data for the logged-in company
  const company = {
    name: "Entreprise Demo SAS",
    logo: "E",
  };
  
  // Navigation items for the sidebar
  const navItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: LayoutDashboard },
    { name: "Interventions", path: "/dashboard/interventions", icon: FileText },
    { name: "Nouveau ticket", path: "/dashboard/create-ticket", icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="bg-white shadow-sm md:hidden p-4 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-lg text-primary">
          InterFlow
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Sidebar for desktop / mobile menu */}
      <div 
        className={`bg-white shadow-md ${
          isMenuOpen ? "block" : "hidden"
        } md:block md:w-64 md:min-h-screen transition-all duration-300`}
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
              {company.logo}
            </div>
            <div>
              <div className="font-medium text-sm text-gray-600">Bienvenue,</div>
              <div className="font-semibold truncate">{company.name}</div>
            </div>
          </div>
        </div>
        
        {/* Navigation menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-red-500">
              <LogOut size={20} className="mr-2" />
              Déconnexion
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">{children}</div>
    </div>
  );
};
