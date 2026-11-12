import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductLines from "@/components/ProductLines";
import BurgerBuilder from "@/components/BurgerBuilder";
import Showcase from "@/components/Showcase";
import FormSection from "@/components/FormSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductLines />
        <BurgerBuilder />
        <Showcase />
        <FormSection />
      </main>
      <Footer />
    </>
  );
}
