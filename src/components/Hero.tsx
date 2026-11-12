"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <Image
          src="/images/bag-handoff.jpg"
          alt="Entrega Craft Bun"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-craft-black/80 via-craft-black/70 to-craft-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-craft-black/90 via-craft-black/30 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block rounded-full border border-craft-orange/50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-craft-orange-light">
            Pão de food service
          </span>
          <h1 className="text-display mt-5 text-5xl leading-[0.95] text-craft-cream sm:text-6xl lg:text-7xl">
            O burger
            <br />
            começa <span className="text-craft-orange">pelo pão</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-craft-cream-dim">
            Pães artesanais Tradicional, Brioche e Gergelim, feitos em escala
            industrial para hamburguerias e distribuidoras que não abrem mão
            de qualidade.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={scrollToForm}
              className="rounded-full bg-craft-orange px-7 py-3.5 text-base font-bold text-craft-black shadow-lg shadow-craft-orange/20 transition hover:scale-105 hover:bg-craft-orange-light cursor-pointer"
            >
              Quero virar parceiro
            </button>
            <a
              href="#linhas-pao"
              className="rounded-full border border-craft-cream/30 px-7 py-3.5 text-base font-semibold text-craft-cream transition hover:border-craft-orange hover:text-craft-orange"
            >
              Ver linhas de pão
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hidden md:block"
        >
          <div className="relative mx-auto aspect-square w-full max-w-sm animate-float-slow">
            <Image
              src="/images/burger-box.jpg"
              alt="Hambúrguer feito com pão Craft Bun"
              fill
              className="rounded-3xl object-cover shadow-2xl shadow-black/60 ring-1 ring-craft-orange/30"
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-craft-cream-dim">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
