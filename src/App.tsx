import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InterventionAccess from "./pages/InterventionAccess";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Interventions from "./pages/Interventions";
import CreateTicket from "./pages/CreateTicket";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/intervention" element={<InterventionAccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/interventions" element={<Interventions />} />
          <Route path="/dashboard/create-ticket" element={<CreateTicket />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
