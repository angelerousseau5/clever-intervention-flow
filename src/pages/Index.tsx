
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AppDescription } from "@/components/AppDescription";
import { AppTester } from "@/components/AppTester";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex-grow">
        <Hero />
        <Features />
        <AppDescription />
        <AppTester />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
