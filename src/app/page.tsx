import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Organization } from "@/components/Organization";
import { Programs } from "@/components/Programs";
import { Gallery } from "@/components/Gallery";
import { Schedule } from "@/components/Schedule";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

/**
 * IRMA Al-Ittihad — single-page scrolling portfolio.
 * Sections: Hero → About → Management → Programs → Gallery →
 *           Schedule/Prayer → Registration/Contact.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Organization />
        <Programs />
        <Gallery />
        <Schedule />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
