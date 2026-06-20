import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const TECH_STACK = [
  {
    name: "Next.js",
    fit: "SEO-ready frontend",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Laravel",
    fit: "Backend bisnis stabil",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
  },
  {
    name: "React.js",
    fit: "Interface interaktif",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    name: "Tailwind CSS",
    fit: "UI modern konsisten",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Docker",
    fit: "Deployment konsisten",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  },
  {
    name: "Redis",
    fit: "Caching cepat",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
  },
  {
    name: "Figma",
    fit: "Desain UI/UX",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
  },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[92svh] items-center overflow-hidden px-6 pb-16 pt-24"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.13),transparent_28%),linear-gradient(315deg,rgba(15,23,42,0.9),#09090b_64%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 border-b border-white/[0.04] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] xl:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p
              className="hero-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase font-sans tracking-[0.18em] text-zinc-50"
              style={{ "--reveal-delay": "100ms" }}
            >
              IT Agency Banyuwangi
            </p>

            <h1
              className="mt-6 max-w-3xl text-base font-sans font-semibold text-3xl leading-[1.04] tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl"
              style={{ "--reveal-delay": "250ms" }}
            >
              Website cepat, elegan, dan siap dipakai sebagai aset bisnis.
            </h1>

            <p
              className="hero-reveal mt-6 max-w-2xl text-base leading-7 font-sans text-zinc-400 sm:text-lg"
              style={{ "--reveal-delay": "400ms" }}
            >
              ThreeDevs membangun company profile, landing page, e-commerce,
              dan web app dengan arsitektur rapi, Lighthouse-friendly, dan
              desain yang terlihat matang di mata calon pelanggan.
            </p>

            <div
              className="hero-reveal mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ "--reveal-delay": "550ms" }}
            >
              <a
                href="/order"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-xl hover:shadow-cyan-500/10"
              >
                Mulai Proyek <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#showcase"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 px-5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                Lihat Showcase
              </a>
            </div>

            <div
              className="hero-reveal mt-10 grid max-w-xl grid-cols-1 gap-3 text-sm text-zinc-500 sm:grid-cols-3"
              style={{ "--reveal-delay": "700ms" }}
            >
              {["Static-first", "SEO-ready", "Handover rapi"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[27rem] items-center justify-center sm:min-h-[32rem] lg:min-h-[39rem]">
            <ProjectPreview />
          </div>
        </div>

        <TechStackMarquee />
      </div>
    </section>
  );
}

function TechStackMarquee() {
  return (
    <div
      className="hero-reveal mt-14 border-y border-white/[0.07] py-5"
      style={{ "--reveal-delay": "850ms" }}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Modern stack for business projects
        </p>
        <p className="max-w-xl text-sm leading-6 text-zinc-500">
          Next.js, Laravel, React.js, Tailwind CSS, Docker, dan Redis kami
          gunakan untuk membangun website bisnis yang cepat, rapi, scalable,
          dan mudah dikembangkan.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TECH_STACK.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.035] px-4 py-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-100">
              <Image
                src={item.logo}
                alt={`${item.name} logo`}
                width={24}
                height={24}
                unoptimized
                loading="lazy"
                className="h-6 w-6 object-contain"
              />
            </span>
            <span>
              <span className="block text-sm font-semibold text-zinc-100">
                {item.name}
              </span>
              <span className="mt-0.5 block text-xs text-zinc-500">
                {item.fit}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectPreview() {
  return (
    <div
      className="hero-reveal relative w-full max-w-[54rem] lg:-mr-20 xl:-mr-28"
      style={{ "--reveal-delay": "450ms" }}
    >
      <div className="absolute inset-x-6 top-8 h-64 rounded-[40%] bg-cyan-400/15 blur-3xl sm:h-80" />
      <div className="absolute inset-y-8 right-0 w-48 rounded-[45%] bg-emerald-300/10 blur-2xl" />

      <div className="relative mb-10 aspect-[2616/1900]">
        <Image
          src="/Frame 1.png"
          alt="Ilustrasi layanan website ThreeDevs dengan performa, SEO, dan keamanan"
          width={2616}
          height={1900}
          priority
          quality={100}
          sizes="(min-width: 1280px) 60rem, (min-width: 1024px) 54rem, (min-width: 640px) 44rem, 100vw"
          className="h-full w-full object-contain drop-shadow-2xl"
        />
      </div>

      <div className="absolute -bottom-8 left-3 right-3 z-20 grid grid-cols-3 gap-3 sm:-bottom-7 sm:left-8 sm:right-8 lg:left-14 lg:right-14">
        {[
          ["90+", "Perf score"],
          ["35+", "Project"],
          ["14 hari", "Delivery"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-lg border border-white/10 bg-zinc-950/88 p-3 text-center shadow-xl shadow-black/25 backdrop-blur"
          >
            <p className="text-lg font-semibold text-zinc-100">{value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-600">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
