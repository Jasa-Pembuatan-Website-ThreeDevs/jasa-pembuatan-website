import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Code2,
  Database,
  Gauge,
  GitBranch,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { FAQS, PLANS, TEAM } from "@/lib/constants";

const SHOWCASE_POINTS = [
  "Static-first rendering untuk halaman publik agar HTML cepat sampai ke browser",
  "Image sizing stabil untuk menekan layout shift dan menjaga CLS tetap rendah",
  "Interaksi penting dibuat ringan, tanpa animasi besar yang membebani main thread",
];

const BACKEND_STANDARDS = [
  {
    title: "API contract jelas",
    description:
      "Endpoint, payload, validasi, dan error response dibuat konsisten agar frontend, admin, dan integrasi pihak ketiga tidak rapuh.",
    icon: GitBranch,
  },
  {
    title: "Security by default",
    description:
      "Autentikasi, otorisasi, rate limit, audit trail, dan sanitasi input diperlakukan sebagai baseline, bukan tambahan belakangan.",
    icon: LockKeyhole,
  },
  {
    title: "Operasional siap scale",
    description:
      "Cache, queue, container deployment, backup, logging, dan monitoring disiapkan agar sistem mudah dirawat saat traffic tumbuh.",
    icon: Server,
  },
];

const DELIVERY_METRICS = [
  ["90+", "Target Lighthouse performance untuk halaman marketing"],
  ["< 2.5s", "Prioritas LCP dengan aset lokal dan layout stabil"],
  ["0", "Dependency animasi wajib untuk halaman publik"],
  ["1 repo", "Handover source code, dokumentasi, dan deployment notes"],
];

const PORTFOLIO_ITEMS = [
  ["Company Profile", "Brand trust, layanan, CTA WhatsApp"],
  ["E-commerce", "Katalog, checkout, pembayaran, admin"],
  ["Dashboard App", "Role access, laporan, workflow internal"],
  ["Landing Page", "Campaign cepat, SEO, conversion tracking"],
];

export default function HomeStaticSections() {
  return (
    <>
      <ShowcaseStatic />
      <BackendStandards />
      <PortfolioStatic />
      <PricingStatic />
      <TeamStatic />
      <FaqStatic />
      <ContactStatic />
    </>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/80">
          {eyebrow}
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-md text-sm leading-6 text-zinc-500">{description}</p>
      ) : null}
    </div>
  );
}

function ShowcaseStatic() {
  return (
    <section id="showcase" className="border-t border-white/[0.06] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Showcase"
          title="Tampilan matang tanpa beban animasi berlebihan."
          description="Komposisi dibuat untuk bisnis: cepat dipahami, mudah discan, dan tetap elegan saat dibuka di perangkat mobile."
        />

        <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.025] p-4 shadow-2xl shadow-black/20">
            <div className="overflow-hidden rounded-md border border-white/[0.08] bg-zinc-950">
              <Image
                src="/threedevs.png"
                alt="ThreeDevs website preview"
                width={1200}
                height={700}
                sizes="(min-width: 1024px) 680px, 100vw"
                className="h-auto w-full object-cover object-top"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {SHOWCASE_POINTS.map((point) => (
              <div
                key={point}
                className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5"
              >
                <Check className="mb-4 h-5 w-5 text-cyan-300" />
                <p className="text-sm leading-6 text-zinc-300">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {DELIVERY_METRICS.map(([value, label]) => (
            <div key={label} className="bg-zinc-950 p-5">
              <p className="text-2xl font-semibold tracking-tight text-zinc-100">
                {value}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BackendStandards() {
  return (
    <section id="about" className="border-t border-white/[0.06] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Enterprise backend standard"
          title="Fondasi backend dirancang seperti sistem bisnis jangka panjang."
          description="Kami mengutamakan kontrak API, keamanan, observability, dan deployment yang bisa diaudit agar sistem mudah dikembangkan oleh tim berikutnya."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {BACKEND_STANDARDS.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-6"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-zinc-950 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 rounded-lg border border-white/[0.08] bg-white/[0.025] p-6 md:grid-cols-4">
          {[
            [Workflow, "Queue-ready workflows"],
            [Database, "Cache & data integrity"],
            [ShieldCheck, "Role based access"],
            [Gauge, "Performance budgets"],
          ].map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 text-sm text-zinc-400">
              <Icon className="h-4 w-4 text-cyan-300" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioStatic() {
  return (
    <section
      id="portfolio"
      className="border-y border-white/[0.06] bg-zinc-950 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Portfolio direction"
          title="Struktur visual yang siap dipakai untuk kebutuhan bisnis nyata."
          description="Kami tidak memulai dari efek. Kami mulai dari prioritas informasi, alur konversi, dan maintainability."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PORTFOLIO_ITEMS.map(([title, description]) => (
            <article
              key={title}
              className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5"
            >
              <Code2 className="mb-8 h-5 w-5 text-cyan-300" />
              <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {description}
              </p>
            </article>
          ))}
        </div>

        <a
          href="/portfolio"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-white"
        >
          Lihat Portfolio <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function PricingStatic() {
  return (
    <section id="pricing" className="border-t border-white/[0.06] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Paket transparan untuk kebutuhan yang berbeda."
          description="Semua paket sudah termasuk konsultasi kebutuhan, desain responsif, dan handover teknis setelah website live."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-lg border p-7 ${
                plan.highlighted
                  ? "border-cyan-300/30 bg-white/[0.06] shadow-2xl shadow-cyan-950/20"
                  : "border-white/[0.08] bg-white/[0.025]"
              }`}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-6 rounded-full bg-cyan-200 px-3 py-0.5 text-[11px] font-semibold text-zinc-950">
                  Paling Populer
                </span>
              ) : null}

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-zinc-200">
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-100">
                    Rp {plan.price}
                  </span>
                  <span className="text-sm text-zinc-600">{plan.unit}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-500">{plan.desc}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-zinc-400"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300/80" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/order"
                className={`block min-h-11 w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-zinc-100 text-zinc-950 hover:bg-white"
                    : "border border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                Pilih Paket
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamStatic() {
  return (
    <section id="team" className="border-t border-white/[0.06] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Team"
          title="Tim kecil dengan ownership teknis yang jelas."
          description="Setiap role punya area tanggung jawab, dari UI, backend, QA, sampai handover."
        />
        <div className="mb-6 max-w-xl text-sm leading-6 text-zinc-500">
          <a href="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300/80 hover:text-cyan-300">
            Lihat Tim <ArrowUpRight className="h-4 w-4" />
          </a>
          </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-4"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-zinc-900">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 190px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">
                {member.name}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqStatic() {
  return (
    <section id="faq" className="border-t border-white/[0.06] px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Pertanyaan yang sering muncul sebelum proyek dimulai."
        />

        <div className="divide-y divide-white/[0.08] rounded-lg border border-white/[0.08] bg-white/[0.025]">
          {FAQS.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-100 [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="mt-4 text-sm leading-6 text-zinc-500">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactStatic() {
  return (
    <section id="contact" className="border-t border-white/[0.06] px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/80">
            Contact
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Mulai proyek dengan scope yang jelas.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
            Ceritakan kebutuhan bisnis, target pengguna, fitur utama, dan
            deadline. Kami akan bantu susun prioritas teknis sebelum development.
          </p>
          <a
            href="/order"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-white"
          >
            Mulai Proyek <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-4">
          <ContactItem icon={Mail} label="Email" value="threedevs@gmail.com" />
          <ContactItem icon={Phone} label="WhatsApp" value="+62 8953-6875-7054" />
          <ContactItem icon={MapPin} label="Lokasi" value="Banyuwangi, Indonesia" />
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-950 text-cyan-300">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs text-zinc-600">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-300">{value}</p>
    </div>
  );
}
