import Hero from "../components/Hero";
import WhyAriva from "../components/WhyAriva";
import Destinations from "../components/Destinations";
import Packages from "../components/Packages";
import Builder from "../components/Builder";
import Stays from "../components/Stays";
import Guides from "../components/Guides";
import Businesses from "../components/Businesses";
import Reviews from "../components/Reviews";
import Faq from "../components/Faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyAriva />
      <Destinations />
      <Packages />
      <Builder />
      <Stays />
      <Guides />
      <Businesses />
      <Reviews />
      <Faq />
    </main>
  );
}
