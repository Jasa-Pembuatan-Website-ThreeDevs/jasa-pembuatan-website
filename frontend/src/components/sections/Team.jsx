"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Server } from "lucide-react";
import { TEAM, fadeUp, stagger } from "@/lib/constants";

export default function TeamSection() {
  return (
    <section id="team" className="relative z-10 border-t border-white/[0.06] px-6 py-28">
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/80">
              Team
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
              Tim kecil dengan standar eksekusi yang rapi.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-zinc-500">
            Setiap project ditangani dengan pembagian peran yang jelas: UI,
            backend, quality assurance, dan handover.
          </p>
          <a href="/team" className="hidden rounded-md bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-300 transition-colors duration-200 hover:bg-cyan-300/20 md:inline-flex">
            Detail Tim Kami
          </a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <MemberCard member={TEAM[0]} />

          <motion.div
            variants={fadeUp}
            className="group relative z-10 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.025] p-7 sm:row-span-2"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                {TEAM[1].badge && (
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-2.5 py-0.5 text-[11px] text-zinc-400">
                    <Server className="h-3 w-3 text-cyan-300" />
                    {TEAM[1].badge}
                  </span>
                )}
                <h3 className="mt-2 text-lg font-semibold text-zinc-100">
                  {TEAM[1].name}
                </h3>
                <p className="text-sm text-zinc-500">{TEAM[1].role}</p>
              </div>
              <div className="relative mt-3 h-48 overflow-hidden rounded-md">
                <Image
                  src={TEAM[1].img}
                  alt={TEAM[1].name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
            </div>
          </motion.div>

          <MemberCard member={TEAM[2]} />
          <MemberCard member={TEAM[3]} />
          <MemberCard member={TEAM[4]} />
        </motion.div>
      </div>
    </section>
  );
}

function MemberCard({ member }) {
  const Icon = member.icon;
  return (
    <motion.div
      variants={fadeUp}
      className="group relative z-10 flex flex-col justify-between overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.025] p-7 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.14]"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2 text-zinc-600">
          <Icon className="h-4 w-4 text-cyan-300/80" />
          <span className="text-xs text-zinc-600">{member.role}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-2.5 py-0.5 text-[11px] text-zinc-400">{member.badge}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-zinc-100">{member.name}</h3>
      </div>
      <div className="relative mt-4 h-28 overflow-hidden rounded-md">
        <Image
          src={member.img}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />
      </div>
    </motion.div>
  );
}
