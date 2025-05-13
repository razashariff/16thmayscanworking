
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"

const root = createRoot(document.getElementById("root")!);

root.render(
  <>
    <App />
    <Toaster />
  </>
);
