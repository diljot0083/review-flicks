import { useReveal } from "../components/hooks/useReveal";

const About = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div className="bg-ink">
      <section className="grain relative overflow-hidden border-b border-white/5 px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="animate-sway absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2"
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent, rgba(212,162,78,0.22), transparent 50%)",
              filter: "blur(60px)",
            }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0b0a0f_100%)]" />
        <h1 className="font-display relative z-10 text-4xl font-bold text-ivory sm:text-5xl">
          Meet the Developer <span className="text-gradient-gold">Behind the Screen</span>
        </h1>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div
          ref={ref}
          className={`reveal ${visible ? "reveal-visible" : ""} glass rounded-3xl p-8 sm:p-12`}
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light to-gold font-display text-xl font-bold text-ink">
              DS
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ivory">Hey, I'm Diljot Singh</h2>
              <p className="text-sm text-ivory/45">Aspiring Software Developer</p>
            </div>
          </div>

          <div className="space-y-5 leading-relaxed text-ivory/65">
            <p>
              An aspiring Software Developer with a strong foundation in C++, the MERN stack, and data
              structures. I'm passionate about building efficient, scalable, and user-centric software -
              and I enjoy creating full-stack applications that are both functional and intuitive.
            </p>
            <p>
              As a coding enthusiast, I've gained hands-on experience through various C++ projects that
              sharpened my problem-solving abilities. I'm well-versed in algorithms, data structures, and
              scripting in C++, and I constantly work at writing clean, optimized code.
            </p>
            <p>
              Right now I'm going deeper into MERN stack development, exploring how to build dynamic,
              responsive full-stack web applications. As a fresher in this field, I stay eager to learn,
              experiment, and keep up with new tools and techniques.
            </p>
            <p>
              This movie review site is a result of that learning journey - combining my skills,
              creativity, and love for building meaningful digital experiences. Welcome, and I hope you
              enjoy exploring it as much as I enjoyed building it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;