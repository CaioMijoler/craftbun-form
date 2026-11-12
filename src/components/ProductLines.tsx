"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LINHAS = [
  { key: "brioche", nome: "Brioche", src: "/images/linha-brioche.jpg", delay: "0s" },
  { key: "tradicional", nome: "Tradicional", src: "/images/linha-tradicional.jpg", delay: "-11.333s" },
  { key: "gergelim", nome: "Gergelim", src: "/images/linha-gergelim.jpg", delay: "-22.666s" },
];

export default function ProductLines() {
  return (
    <section
      id="linhas-pao"
      className="relative overflow-hidden bg-craft-black py-24"
    >
      <div className="bg-grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-craft-orange">
          Nosso catálogo
        </span>
        <h2 className="text-display mt-3 text-4xl text-craft-cream sm:text-5xl">
          As três linhas de pão Craft Bun
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-craft-cream-dim">
          Tradicional, Brioche e Gergelim — cada uma pensada para um tipo de
          operação, sempre fatiada, macia por dentro e assada no ponto certo.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto mt-24 h-[420px] w-full max-w-xl sm:mt-28 sm:h-[500px] lg:h-[620px]"
        >
          <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-craft-orange/40 bg-craft-black-soft shadow-xl shadow-black/50 sm:h-24 sm:w-24">
            <div className="relative h-10 w-10 overflow-hidden rounded-full sm:h-12 sm:w-12">
              <Image
                src="/images/logo-craftbun.jpg"
                alt="Craft Bun"
                fill
                className="object-cover object-top scale-125"
              />
            </div>
          </div>

          {LINHAS.map((linha) => (
            <div
              key={linha.key}
              className="absolute left-1/2 top-1/2 animate-orbit [--orbit-radius:170px] [--orbit-duration:34s] sm:[--orbit-radius:235px] lg:[--orbit-radius:290px]"
              style={{ animationDelay: linha.delay }}
            >
              <div className="group relative aspect-[6/5] w-48 overflow-hidden rounded-xl bg-craft-black-soft shadow-lg shadow-black/50 ring-1 ring-craft-orange/30 transition hover:scale-105 hover:ring-craft-orange sm:w-64 lg:w-80">
                <Image
                  src={linha.src}
                  alt={`Linha ${linha.nome} — pão hambúrguer Craft Bun`}
                  fill
                  className="object-cover object-[center_21%]"
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 256px, 192px"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
