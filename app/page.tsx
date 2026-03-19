import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyMREA from "@/components/WhyMREA";
import Events from "@/components/Events";
import SpeakAtMREA from "@/components/SpeakAtMREA";
import Leadership from "@/components/Leadership";
import JoinCTA from "@/components/JoinCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyMREA />
        <Events />
        <SpeakAtMREA />
        <Leadership />
        <JoinCTA />
      </main>
      <Footer />
    </>
  );
}
