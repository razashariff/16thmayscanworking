
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ServicesPage from "./pages/Services";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SecurityAudits from "./pages/SecurityAudits";
import VibeCodingSecurity from "./pages/VibeCodingSecurity";
import ThreatDetection from "./pages/ThreatDetection";
import DataProtection from "./pages/DataProtection";
import SecurityTraining from "./pages/SecurityTraining";
import IncidentResponse from "./pages/IncidentResponse";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/security-audits" element={<SecurityAudits />} />
          <Route path="/vibe-coding-security" element={<VibeCodingSecurity />} />
          <Route path="/threat-detection" element={<ThreatDetection />} />
          <Route path="/data-protection" element={<DataProtection />} />
          <Route path="/security-training" element={<SecurityTraining />} />
          <Route path="/incident-response" element={<IncidentResponse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
