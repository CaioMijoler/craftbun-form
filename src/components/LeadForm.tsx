"use client";

import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TIPOS_ESTABELECIMENTO,
  VOLUME_MENSAL,
  LINHAS_PAO,
} from "@/lib/constants";

type FormState = {
  estabelecimento: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  tipos: string[];
  tipoOutro: string;
  volumeMensal: string;
  volumeMensalOutro: string;
  linhas: string[];
  jaCompra: "" | "Sim" | "Não";
};

const INITIAL_STATE: FormState = {
  estabelecimento: "",
  whatsapp: "",
  cidade: "",
  estado: "",
  tipos: [],
  tipoOutro: "",
  volumeMensal: "",
  volumeMensalOutro: "",
  linhas: [],
  jaCompra: "",
};

const WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL ?? "";
const SUBMIT_CACHE_KEY = "craftbun_lead_last_submit";
const SUBMIT_CACHE_MS = 60_000;

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function LeadForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  useEffect(() => {
    const stored = window.localStorage.getItem(SUBMIT_CACHE_KEY);
    if (!stored) return;

    const remaining = SUBMIT_CACHE_MS - (Date.now() - Number(stored));
    if (remaining <= 0) {
      window.localStorage.removeItem(SUBMIT_CACHE_KEY);
      return;
    }

    // Syncs from localStorage (an external, browser-only store) on mount —
    // can't be known during SSR, so this can't be a lazy useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("done");
    const timer = setTimeout(() => {
      window.localStorage.removeItem(SUBMIT_CACHE_KEY);
      setStatus("idle");
    }, remaining);
    return () => clearTimeout(timer);
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.estabelecimento.trim()) next.estabelecimento = "Informe o nome do estabelecimento.";
    if (!form.whatsapp.trim()) next.whatsapp = "Informe um WhatsApp para contato.";
    if (!form.cidade.trim()) next.cidade = "Informe a cidade.";
    if (!form.estado.trim()) next.estado = "Informe o estado.";
    if (form.tipos.length === 0) next.tipos = "Selecione ao menos um tipo de estabelecimento.";
    if (form.tipos.includes("Outra") && !form.tipoOutro.trim())
      next.tipoOutro = "Conte qual é o tipo do seu estabelecimento.";
    if (!form.volumeMensal) next.volumeMensal = "Selecione o volume mensal.";
    if (form.volumeMensal === "Outro" && !form.volumeMensalOutro.trim())
      next.volumeMensalOutro = "Informe o volume mensal aproximado.";
    if (form.linhas.length === 0) next.linhas = "Selecione ao menos uma linha de pão.";
    if (!form.jaCompra) next.jaCompra = "Selecione uma opção.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    const payload = {
      estabelecimento: form.estabelecimento,
      whatsapp: form.whatsapp,
      cidade: form.cidade,
      estado: form.estado,
      tiposEstabelecimento: form.tipos.join(", "),
      tipoOutro: form.tipoOutro,
      volumeMensal:
        form.volumeMensal === "Outro" ? form.volumeMensalOutro : form.volumeMensal,
      linhasInteresse: form.linhas.join(", "),
      jaCompraCraftBun: form.jaCompra,
    };

    try {
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
      }
      window.localStorage.setItem(SUBMIT_CACHE_KEY, String(Date.now()));
      setTimeout(() => {
        window.localStorage.removeItem(SUBMIT_CACHE_KEY);
        setStatus("idle");
      }, SUBMIT_CACHE_MS);
      setStatus("done");
      setForm(INITIAL_STATE);
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-craft-orange/40 bg-craft-black-soft p-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-craft-orange/15">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-craft-orange">
            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-display text-3xl text-craft-cream">Recebemos seu contato!</h3>
        <p className="mx-auto mt-3 max-w-md text-craft-cream-dim">
          Estamos com uma demanda muito alta. Em breve nossos vendedores entrarão em contato.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome do estabelecimento" error={errors.estabelecimento}>
          <input
            type="text"
            value={form.estabelecimento}
            onChange={(e) => update("estabelecimento", e.target.value)}
            placeholder="Ex: Hamburgueria do João"
            className={inputClass}
          />
        </Field>

        <Field label="WhatsApp para contato" error={errors.whatsapp}>
          <input
            type="tel"
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="(11) 99999-9999"
            className={inputClass}
          />
        </Field>

        <Field label="Cidade" error={errors.cidade}>
          <input
            type="text"
            value={form.cidade}
            onChange={(e) => update("cidade", e.target.value)}
            placeholder="Ex: São Paulo"
            className={inputClass}
          />
        </Field>

        <Field label="Estado" error={errors.estado}>
          <input
            type="text"
            value={form.estado}
            onChange={(e) => update("estado", e.target.value)}
            placeholder="Ex: SP"
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="Tipo de estabelecimento (selecione uma ou mais opções)"
        error={errors.tipos}
      >
        <div className="flex flex-wrap gap-3">
          {TIPOS_ESTABELECIMENTO.map((tipo) => (
            <Checkbox
              key={tipo}
              label={tipo}
              checked={form.tipos.includes(tipo)}
              onChange={() => update("tipos", toggleValue(form.tipos, tipo))}
            />
          ))}
        </div>
        <AnimatePresence>
          {form.tipos.includes("Outra") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                value={form.tipoOutro}
                onChange={(e) => update("tipoOutro", e.target.value)}
                placeholder="Qual tipo de estabelecimento?"
                className={`${inputClass} mt-3`}
              />
              {errors.tipoOutro && (
                <p className="mt-1 text-sm text-red-400">{errors.tipoOutro}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Field>

      <Field label="Volume mensal de consumo de pães" error={errors.volumeMensal}>
        <div className="grid gap-2 sm:grid-cols-2">
          {VOLUME_MENSAL.map((opt) => (
            <Radio
              key={opt}
              name="volumeMensal"
              label={opt}
              checked={form.volumeMensal === opt}
              onChange={() => update("volumeMensal", opt)}
            />
          ))}
        </div>
        <AnimatePresence>
          {form.volumeMensal === "Outro" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                value={form.volumeMensalOutro}
                onChange={(e) => update("volumeMensalOutro", e.target.value)}
                placeholder="Qual é o volume mensal aproximado?"
                className={`${inputClass} mt-3`}
              />
              {errors.volumeMensalOutro && (
                <p className="mt-1 text-sm text-red-400">{errors.volumeMensalOutro}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Field>

      <Field
        label="Quais linhas de pães mais interessam à sua operação? (selecione uma ou mais)"
        error={errors.linhas}
      >
        <div className="flex flex-wrap gap-3">
          {LINHAS_PAO.map((linha) => (
            <Checkbox
              key={linha}
              label={linha}
              checked={form.linhas.includes(linha)}
              onChange={() => update("linhas", toggleValue(form.linhas, linha))}
            />
          ))}
        </div>
      </Field>

      <Field label="Você já compra da Craft Bun?" error={errors.jaCompra}>
        <div className="flex gap-3">
          <Radio
            name="jaCompra"
            label="Sim"
            checked={form.jaCompra === "Sim"}
            onChange={() => update("jaCompra", "Sim")}
          />
          <Radio
            name="jaCompra"
            label="Não"
            checked={form.jaCompra === "Não"}
            onChange={() => update("jaCompra", "Não")}
          />
        </div>
      </Field>

      {status === "error" && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Não foi possível enviar agora. Tente novamente em instantes.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-craft-orange px-7 py-4 text-lg font-bold text-craft-black shadow-lg shadow-craft-orange/20 transition hover:scale-[1.01] hover:bg-craft-orange-light disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {status === "submitting" ? "Enviando..." : "Quero ser parceiro Craft Bun"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-craft-cream/15 bg-craft-black px-4 py-3 text-craft-cream placeholder:text-craft-cream-dim/50 outline-none transition focus:border-craft-orange";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-craft-cream-dim">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        checked
          ? "border-craft-orange bg-craft-orange/15 text-craft-orange-light"
          : "border-craft-cream/20 text-craft-cream-dim hover:border-craft-orange/50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function Radio({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
        checked
          ? "border-craft-orange bg-craft-orange/15 text-craft-orange-light"
          : "border-craft-cream/20 text-craft-cream-dim hover:border-craft-orange/50"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}
