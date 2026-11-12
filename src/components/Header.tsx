"use client";

import Image from "next/image";

export default function Header() {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-craft-orange/20 bg-craft-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-craft-orange/40">
            <Image
              src="/images/logo-craftbun.jpg"
              alt="Craft Bun"
              fill
              className="object-cover object-top scale-125"
              priority
            />
          </div>
          <span className="text-display text-2xl leading-none text-craft-cream">
            Craft<span className="text-craft-orange">Bun</span>
          </span>
        </div>
        <button
          onClick={scrollToForm}
          className="rounded-full bg-craft-orange px-5 py-2 text-sm font-semibold text-craft-black transition hover:bg-craft-orange-light cursor-pointer"
        >
          Quero ser parceiro
        </button>
      </div>
    </header>
  );
}
