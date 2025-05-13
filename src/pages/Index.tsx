
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import About from '@/components/About';
import Footer from '@/components/Footer';
import VibeSecurity from '@/components/VibeSecurity';
import TestScanButton from '@/components/TestScanButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-end mb-4">
          <TestScanButton />
        </div>
      </div>
      <VibeSecurity />
      <Services />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
