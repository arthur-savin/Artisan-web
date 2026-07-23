import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Why } from "@/components/Why";
import { Process } from "@/components/Process";
import { Portfolio } from "@/components/Portfolio";
import { Offers } from "@/components/Offers";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#hero">
        Aller au contenu
      </a>
      <Header />
      <main>
        <Hero />
        <Why />
        <Process />
        <Portfolio />
        <Offers />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
