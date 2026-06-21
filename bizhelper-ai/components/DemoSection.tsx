import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Generator from "./Generator";

export default function DemoSection() {
  return (
    <section id="demo" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Live demo"
          title={
            <>
              Try the generator{" "}
              <span className="text-gradient">right now</span>
            </>
          }
          subtitle="This is the real interface. It returns sample content instantly — connect your own AI key to make it production-ready."
        />

        <Reveal className="mt-14" delay={0.1}>
          <Generator />
        </Reveal>
      </div>
    </section>
  );
}
