import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedSplitSection from '../components/FeaturedSplitSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroSection />
        <p className="championsText">For Champions</p>
        <FeaturedSplitSection />
      </main>
      <Footer />
    </div>
  );
}
