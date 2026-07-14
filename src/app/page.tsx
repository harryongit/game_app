import { SceneWrapper } from "@/components/canvas/SceneWrapper";
import { Hero } from "@/components/landing/Hero";
import { GamesShowcase } from "@/components/landing/GamesShowcase";
import { Features } from "@/components/landing/Features";
import { TopWinners } from "@/components/landing/TopWinners";
import { Timeline } from "@/components/landing/Timeline";
import { Testimonials } from "@/components/landing/Testimonials";
import { Stats } from "@/components/landing/Stats";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <SceneWrapper />
      <Hero />
      <GamesShowcase />
      <Features />
      <TopWinners />
      <Timeline />
      <Stats />
      <Testimonials />
      <Footer />
    </main>
  );
}
