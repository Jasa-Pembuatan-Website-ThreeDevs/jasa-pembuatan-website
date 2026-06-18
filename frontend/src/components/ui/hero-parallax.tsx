"use client";
import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";

type Product = {
  title: string;
  link: string;
  thumbnail: string;
};

export const HeroParallax = ({
  products,
  title = "The Ultimate development studio",
  description = "We build beautiful products with the latest technologies and frameworks.",
}: {
  products: Product[];
  title?: string;
  description?: string;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="relative flex h-[230vh] flex-col self-auto overflow-hidden py-24 antialiased [perspective:1000px] [transform-style:preserve-3d] sm:h-[260vh] sm:py-32 lg:h-[285vh] lg:py-40"
    >
      <Header title={title} description={description} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="mb-8 flex flex-row-reverse space-x-6 space-x-reverse sm:mb-14 sm:space-x-12 lg:mb-20 lg:space-x-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="mb-8 flex flex-row space-x-6 sm:mb-14 sm:space-x-12 lg:mb-20 lg:space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-6 space-x-reverse sm:space-x-12 lg:space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-6xl px-6 py-14 md:py-28">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
        Portfolio
      </p>
      <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-zinc-100 md:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-500 md:text-lg">
        {description}
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: Product;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product relative h-56 w-[18rem] shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-zinc-900 shadow-2xl shadow-black/20 sm:h-72 sm:w-[24rem] lg:h-80 lg:w-[30rem]"
    >
      <a
        href={product.link}
        className="block h-full group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          fill
          unoptimized
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 384px, 288px"
          className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-500 group-hover/product:scale-105"
          alt={product.title}
        />
      </a>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 transition-opacity duration-300 group-hover/product:opacity-70"></div>
      <h2 className="absolute bottom-4 left-4 max-w-[80%] text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover/product:opacity-100 sm:text-base">
        {product.title}
      </h2>
    </motion.div>
  );
};
