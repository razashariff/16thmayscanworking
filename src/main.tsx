import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReportPage from './pages/report/ReportPage';

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/report/:scanId" element={<ReportPage />} />
      <Route path="/*" element={<App />} />
    </Routes>
    <Toaster />
  </BrowserRouter>
);
