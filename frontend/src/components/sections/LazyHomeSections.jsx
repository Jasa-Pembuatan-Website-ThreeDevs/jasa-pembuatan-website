"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ShowcaseSection = dynamic(() => import("@/components/sections/Showcase"), {
  ssr: false,
});

const PricingSection = dynamic(() => import("@/components/sections/Pricing"), {
  ssr: false,
});

const PortfolioParallaxSection = dynamic(
  () => import("@/components/sections/PortfolioParallax"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[28rem] items-center justify-center border-y border-white/[0.06] text-sm text-zinc-600">
        Loading Portfolio...
      </div>
    ),
  }
);

const AboutSection = dynamic(() => import("@/components/sections/About"), {
  ssr: false,
});

const AboutLampSection = dynamic(
  () => import("@/components/sections/About").then((mod) => mod.AboutLampSection),
  {
    ssr: false,
  }
);

const TeamSection = dynamic(() => import("@/components/sections/Team"), {
  ssr: false,
});

const FaqSection = dynamic(() => import("@/components/sections/FAQ"), {
  ssr: false,
});

const ContactSection = dynamic(() => import("@/components/sections/Contact"), {
  ssr: false,
});

export default function LazyHomeSections() {
  const sentinelRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      {shouldLoad ? (
        <>
          <ShowcaseSection />
          <PortfolioParallaxSection />
          <AboutLampSection />
          <AboutSection />
          <PricingSection />
          <TeamSection />
          <FaqSection />
          <ContactSection />
        </>
      ) : null}
    </>
  );
}
