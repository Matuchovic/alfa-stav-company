import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Numbers from "@/components/Numbers";
import Projects from "@/components/Projects";
import Banner from "@/components/Banner";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Numbers />
      <Projects />
      <Banner />
      <Process />
      <Testimonials />
      <ContactCTA />
      <Footer />
    </main>
  );
}
