
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Navigation, Route as RouteIcon } from "lucide-react";

const Route = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Routes</h1>
          <Button asChild>
            <Link to="/dashboard/create-route">
              <RouteIcon className="mr-2 h-4 w-4" />
              Créer une route
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Route Paris - Lyon</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Distance: 465 km</div>
              <div className="text-xs text-muted-foreground">Durée estimée: 4h30</div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Navigation className="mr-2 h-3 w-3" />
                Voir détails
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Route Marseille - Nice</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Distance: 200 km</div>
              <div className="text-xs text-muted-foreground">Durée estimée: 2h15</div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Navigation className="mr-2 h-3 w-3" />
                Voir détails
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Route Bordeaux - Toulouse</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Distance: 245 km</div>
              <div className="text-xs text-muted-foreground">Durée estimée: 2h30</div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Navigation className="mr-2 h-3 w-3" />
                Voir détails
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Route;
