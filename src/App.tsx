
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InterventionAccess from "./pages/InterventionAccess";
import InterventionForm from "./pages/InterventionForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Interventions from "./pages/Interventions";
import CreateTicket from "./pages/CreateTicket";
import Groups from "./pages/Groups";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/intervention" element={<InterventionAccess />} />
            <Route path="/intervention-form/:id" element={<InterventionForm />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/interventions" element={<ProtectedRoute><Interventions /></ProtectedRoute>} />
            <Route path="/dashboard/create-ticket" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
            <Route path="/dashboard/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
