/**
 * Craft Bun — Lead form backend.
 *
 * Como publicar:
 * 1. Abra (ou crie) a planilha do Google Sheets que vai receber os leads.
 * 2. Menu Extensões > Apps Script.
 * 3. Apague o conteúdo padrão e cole este arquivo inteiro.
 * 4. Implantar > Nova implantação > tipo "App da Web".
 *    - Executar como: Eu (sua conta)
 *    - Quem pode acessar: Qualquer pessoa
 * 5. Autorize as permissões solicitadas.
 * 6. Copie a URL do app da Web (termina em /exec) e cole em
 *    NEXT_PUBLIC_SHEETS_WEBHOOK_URL no .env.local do projeto Next.js.
 *
 * Para reformatar linhas que já existem na planilha (de antes desta versão):
 * no editor do Apps Script, selecione a função "formatarComoTabela" no menu
 * de funções ao lado do botão Executar, e clique em Executar uma vez.
 *
 * Importante: depois de colar uma atualização deste arquivo, o link /exec só
 * passa a rodar o código novo depois que você for em Implantar > Gerenciar
 * implantações > ícone de lápis > Versão: Nova versão > Implantar.
 */

const SHEET_NAME = "Leads";

const COLUMNS = [
  "Data/Hora",
  "Nome do estabelecimento",
  "WhatsApp",
  "Cidade",
  "Estado",
  "Tipo de estabelecimento",
  "Outro tipo (detalhe)",
  "Volume mensal de consumo",
  "Linhas de pão de interesse",
  "Já compra da Craft Bun",
  "Vendedor",
];

const VENDEDORES = ["Carlos Kardec", "Jaime", "Fabrício"];

const HEADER_BACKGROUND = "#3A2213";
const HEADER_FONT_COLOR = "#F4E8CF";
const ROW_COLOR_EVEN = "#E0E0E0";
const ROW_COLOR_ODD = "#FFFFFF";
const BORDER_COLOR = "#999999";

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    configurarPlanilha_(sheet);
  }

  return sheet;
}

/**
 * Deixa a aba com cara de tabela (cabeçalho destacado, linhas alternando
 * branco/cinza, bordas), garante o dropdown de vendedor e o filtro no
 * cabeçalho. Só formata até a última linha com dado — nunca além disso,
 * pra não deixar uma "cauda" de linhas vazias formatadas.
 */
function configurarPlanilha_(sheet) {
  const numCols = COLUMNS.length;
  const lastRow = sheet.getLastRow();

  // Garante que o cabeçalho sempre reflita o array COLUMNS (importante para
  // planilhas criadas antes da coluna "Vendedor" existir).
  sheet.getRange(1, 1, 1, numCols).setValues([COLUMNS]);

  sheet
    .getRange(1, 1, 1, numCols)
    .setFontWeight("bold")
    .setBackground(HEADER_BACKGROUND)
    .setFontColor(HEADER_FONT_COLOR);

  if (lastRow > 1) {
    for (let row = 2; row <= lastRow; row++) {
      sheet
        .getRange(row, 1, 1, numCols)
        .setBackground(row % 2 === 0 ? ROW_COLOR_EVEN : ROW_COLOR_ODD);
    }
  }

  sheet
    .getRange(1, 1, lastRow, numCols)
    .setBorder(true, true, true, true, true, true, BORDER_COLOR, SpreadsheetApp.BorderStyle.SOLID);

  sheet.autoResizeColumns(1, numCols);

  aplicarValidacaoVendedor_(sheet, lastRow);
  aplicarFiltro_(sheet, lastRow);
}

/** Coloca um dropdown com os vendedores na coluna "Vendedor", só nas linhas com dado. */
function aplicarValidacaoVendedor_(sheet, lastRow) {
  if (lastRow < 2) return;

  const col = COLUMNS.indexOf("Vendedor") + 1;
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(VENDEDORES, true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange(2, col, lastRow - 1, 1).setDataValidation(rule);
}

/** Cria (ou recria) o filtro no cabeçalho para permitir filtrar por qualquer coluna. */
function aplicarFiltro_(sheet, lastRow) {
  const existingFilter = sheet.getFilter();
  if (existingFilter) {
    existingFilter.remove();
  }
  sheet.getRange(1, 1, Math.max(lastRow, 2), COLUMNS.length).createFilter();
}

/**
 * Rode manualmente (uma vez) no editor do Apps Script para limpar linhas
 * em branco no meio dos dados e aplicar o estilo de tabela, o dropdown de
 * vendedor e o filtro em uma planilha que já existia antes desta versão
 * do script (ou que ficou com sobras de testes anteriores).
 */
function formatarComoTabela() {
  const sheet = getOrCreateSheet_();
  removerColunaOrigem_(sheet);
  removerLinhasVaziasNoMeio_(sheet);
  configurarPlanilha_(sheet);
}

/**
 * Remove a coluna "Origem (URL)" caso ela ainda exista fisicamente na
 * planilha (de uma versão anterior do script), realinhando as colunas
 * seguintes (como "Vendedor") para a posição correta.
 */
function removerColunaOrigem_(sheet) {
  const cabecalhoAtual = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idx = cabecalhoAtual.indexOf("Origem (URL)");
  if (idx !== -1) {
    sheet.deleteColumn(idx + 1);
  }
}

/** Remove linhas completamente em branco entre o cabeçalho e os dados. */
function removerLinhasVaziasNoMeio_(sheet) {
  const numCols = COLUMNS.length;
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  const valores = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
  for (let i = valores.length - 1; i >= 0; i--) {
    const linhaVazia = valores[i].every((celula) => celula === "" || celula === null);
    if (linhaVazia) {
      sheet.deleteRow(i + 2);
    }
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ result: "error", message: "Corpo da requisição vazio." });
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      data.estabelecimento || "",
      data.whatsapp || "",
      data.cidade || "",
      data.estado || "",
      data.tiposEstabelecimento || "",
      data.tipoOutro || "",
      data.volumeMensal || "",
      data.linhasInteresse || "",
      data.jaCompraCraftBun || "",
      "",
    ]);

    configurarPlanilha_(sheet);

    return jsonResponse_({ result: "success" });
  } catch (error) {
    return jsonResponse_({ result: "error", message: String(error) });
  }
}

function doGet() {
  return jsonResponse_({ result: "ok", message: "Craft Bun lead webhook está no ar." });
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
