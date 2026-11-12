# Craft Bun — Landing Page de Captação de Leads

Landing page em Next.js para captar leads B2B (hamburguerias e distribuidoras)
interessados nas linhas de pão Craft Bun. O formulário envia os dados direto
para uma planilha Google Sheets via Google Apps Script.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Conectando ao Google Sheets

1. Crie (ou abra) uma planilha no Google Sheets.
2. Menu **Extensões > Apps Script**.
3. Apague o conteúdo padrão e cole o conteúdo de
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. **Implantar > Nova implantação > tipo "App da Web"**.
   - Executar como: **Eu** (sua conta)
   - Quem pode acessar: **Qualquer pessoa**
5. Autorize as permissões solicitadas pelo Google.
6. Copie a URL gerada (termina em `/exec`).
7. Crie um arquivo `.env.local` na raiz do projeto baseado em
   [`.env.local.example`](.env.local.example):

   ```bash
   NEXT_PUBLIC_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/SEU_ID/exec
   ```

Cada envio do formulário cria uma linha na aba **Leads** da planilha, com
cabeçalhos criados automaticamente no primeiro envio.

## Deploy na Vercel

1. Suba o projeto para um repositório Git.
2. Importe o repositório em [vercel.com/new](https://vercel.com/new).
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SHEETS_WEBHOOK_URL`
   com a URL do Apps Script.
4. Deploy.

## Estrutura

- `src/components/Hero.tsx` — seção inicial com imagem de entrega e CTA.
- `src/components/BurgerBuilder.tsx` — animação do hambúrguer sendo montado
  camada por camada ao rolar a página.
- `src/components/Showcase.tsx` — galeria com fotos reais do produto.
- `src/components/FormSection.tsx` / `LeadForm.tsx` — formulário de captação,
  com validação e envio ao Google Sheets.
- `google-apps-script/Code.gs` — script que recebe o POST e grava na planilha.
