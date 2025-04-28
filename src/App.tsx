
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from '@/components/ui/sonner';

import Index from './pages/Index';
import About from './pages/About';
import Auth from './pages/Auth';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ContactThankYou from './pages/ContactThankYou';
import DataProtection from './pages/DataProtection';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import PricingPlans from './pages/PricingPlans';
import ServiceSignup from './pages/ServiceSignup';
import Services from './pages/Services';
import SecurityScores from './pages/SecurityScores';
import SecurityAudits from './pages/SecurityAudits';
import SecurityTraining from './pages/SecurityTraining';
import IncidentResponse from './pages/IncidentResponse';
import ThreatDetection from './pages/ThreatDetection';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/PaymentSuccess';
import VibeCodingSecurity from './pages/VibeCodingSecurity';
import VulnerabilityScanner from './pages/VulnerabilityScanner';
import VulnerabilityReport from './pages/VulnerabilityReport';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-thank-you" element={<ContactThankYou />} />
          <Route path="/services" element={<Services />} />
          <Route path="/security-scores" element={<SecurityScores />} />
          <Route path="/security-audits" element={<SecurityAudits />} />
          <Route path="/security-training" element={<SecurityTraining />} />
          <Route path="/incident-response" element={<IncidentResponse />} />
          <Route path="/threat-detection" element={<ThreatDetection />} />
          <Route path="/data-protection" element={<DataProtection />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/service-signup/:plan" element={<ServiceSignup />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/vibe-coding-security" element={<VibeCodingSecurity />} />
          <Route path="/vulnerability-scanner" element={<VulnerabilityScanner />} />
          <Route path="/vulnerability-report/:scanId" element={<VulnerabilityReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
