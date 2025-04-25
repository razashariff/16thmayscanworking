
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import About from '@/components/About';
import Footer from '@/components/Footer';
import VibeSecurity from '@/components/VibeSecurity';

const Index = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <VibeSecurity />
      <Services />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
