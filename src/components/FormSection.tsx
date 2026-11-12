import LeadForm from "@/components/LeadForm";

export default function FormSection() {
  return (
    <section id="formulario" className="relative bg-craft-black-soft py-24">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-craft-orange">
            Fale com o time comercial
          </span>
          <h2 className="text-display mt-3 text-4xl text-craft-cream sm:text-5xl">
            Leve o pão Craft Bun para a sua operação
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-craft-cream-dim">
            Preencha os dados abaixo e um de nossos vendedores vai te mostrar a
            linha ideal para o seu volume de consumo.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-craft-orange/20 bg-craft-black p-6 shadow-2xl shadow-black/40 sm:p-10">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
