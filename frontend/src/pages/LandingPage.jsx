import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CapabilitiesSection from '../components/CapabilitiesSection';
import ContactSection from '../components/ContactSection';

export default function LandingPage() {
    return (
        <div style={{ overflowX: 'hidden' }}>
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <CapabilitiesSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
}
