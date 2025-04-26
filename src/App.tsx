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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import SecurityScores from "./pages/SecurityScores";
import PricingPlans from "./pages/PricingPlans";
import ServiceSignup from "./pages/ServiceSignup";
import PaymentSuccess from "./pages/PaymentSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/security-scores" element={<SecurityScores />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/service-signup/:plan" element={<ServiceSignup />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
