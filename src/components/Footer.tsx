import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-craft-orange/15 bg-craft-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center">
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-craft-orange/40">
          <Image
            src="/images/logo-craftbun.jpg"
            alt="Craft Bun"
            fill
            className="object-cover object-top scale-125"
          />
        </div>
        <p className="text-sm text-craft-cream-dim">
          Craft Bun — Burger começa pelo pão.
        </p>
        <p className="text-xs text-craft-cream-dim/60">
          © 2026 Craft Bun. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
