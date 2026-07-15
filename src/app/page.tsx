import { SceneWrapper } from "@/components/canvas/SceneWrapper";
import { Hero } from "@/components/landing/Hero";
import { GamesShowcase } from "@/components/landing/GamesShowcase";
import { Features } from "@/components/landing/Features";
import { TopWinners } from "@/components/landing/TopWinners";
import { Timeline } from "@/components/landing/Timeline";
import { Testimonials } from "@/components/landing/Testimonials";
import { Stats } from "@/components/landing/Stats";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <SceneWrapper />
      <Hero />
      <GamesShowcase />
      <Reveal variant="up">
        <Features />
      </Reveal>
      <Reveal variant="up">
        <TopWinners />
      </Reveal>
      <Reveal variant="left">
        <Timeline />
      </Reveal>
      <Reveal variant="scale">
        <Stats />
      </Reveal>
      <Reveal variant="up">
        <PromoBanner />
      </Reveal>
      <Reveal variant="up" stagger>
        <Testimonials />
      </Reveal>
      <Reveal variant="fade">
        <Footer />
      </Reveal>
    </main>
  );
}
