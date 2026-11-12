"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LINHAS_PAO } from "@/lib/constants";

export default function BurgerBuilder() {
  return (
    <section id="monte-burger" className="relative overflow-hidden bg-craft-black-soft py-24">
      <div className="bg-grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-5xl px-5">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-craft-orange">
              Burger começa pelo pão
            </span>
            <h2 className="text-display mt-3 text-4xl text-craft-cream sm:text-5xl">
              Monte o hambúrguer perfeito com a base certa
            </h2>
            <p className="mt-5 max-w-md text-craft-cream-dim">
              Nossas três linhas de pão foram desenvolvidas para sustentar
              recheios generosos sem perder estrutura, maciez e sabor — do
              primeiro ao último pedido do dia.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {LINHAS_PAO.map((linha) => (
                <li
                  key={linha}
                  className="rounded-full border border-craft-orange/40 px-4 py-1.5 text-sm font-medium text-craft-orange-light"
                >
                  {linha}
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-black/60 ring-1 ring-craft-orange/30"
          >
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/producao-paes.jpg"
                alt="Linha de produção dos pães Craft Bun"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-craft-black/70 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 right-4 text-sm font-medium text-craft-cream">
              Direto da linha de produção, fresquinho para o seu balcão.
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
