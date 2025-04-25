
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import About from '@/components/About';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <Services />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
