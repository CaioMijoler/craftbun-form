"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ITEMS = [
  {
    src: "/images/burger-bite.jpg",
    alt: "Cliente saboreando hambúrguer com pão Craft Bun",
    title: "Maciez em cada mordida",
    text: "Textura leve e saborosa que não desmancha com molhos e recheios generosos.",
  },
  {
    src: "/images/girl-warehouse.jpg",
    alt: "Pão hambúrguer Craft Bun em embalagem food service",
    title: "Produção em escala",
    text: "Estrutura industrial própria para atender distribuidoras e redes com regularidade.",
  },
  {
    src: "/images/burger-box.jpg",
    alt: "Hambúrguer artesanal servido com pão Craft Bun",
    title: "Aprovado por quem é do ramo",
    text: "Hamburguerias de referência já usam nosso pão como base dos seus melhores lanches.",
  },
];

export default function Showcase() {
  return (
    <section id="diferenciais" className="bg-craft-black py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-craft-orange">
            Por que Craft Bun
          </span>
          <h2 className="text-display mt-3 text-4xl text-craft-cream sm:text-5xl">
            Pão de verdade para quem leva o burger a sério
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group overflow-hidden rounded-2xl border border-craft-orange/20 bg-craft-black-soft"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-craft-black via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-display text-2xl text-craft-orange-light">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-craft-cream-dim">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
