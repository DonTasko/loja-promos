// netlify/functions/amazon.js
// Fonte: Google Apps Script → Google Sheets ("Produtos")
// Usa fetch nativo do Node 18+ (sem dependências externas)

exports.handler = async function (event, context) {
  const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbzXV2COi6q6327Son0xN9pXKK3vWkmMc0FRp6m25MXzJsBbqg80GAR_qvNhP9pFW9JzWA/exec";

  try {
    const response = await fetch(SHEET_URL, { redirect: "follow" });

    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const raw = await response.json();

    if (!Array.isArray(raw)) {
      console.error("❌ Resposta inesperada:", JSON.stringify(raw));
      return ok([]);
    }

    // Apps Script devolve: titulo, imagem, preco, promocao, link, categoria, obs
    const products = raw
      .filter(item => item.titulo && item.titulo.trim() !== "")
      .map(item => {
        const original = parsePrice(item.preco);
        const promo    = parsePrice(item.promocao);

        let discount = 0;
        if (original && promo && promo < original) {
          discount = Math.round(((original - promo) / original) * 100);
        }

        return {
          title:          item.titulo    || "Sem título",
          image:          item.imagem    || "",
          original_price: original,
          promo_price:    promo || original,
          discount:       discount,
          link:           item.link      || "#",
          category:       item.categoria || "Geral",
          obs:            item.obs       || "",
        };
      });

    return ok(products);

  } catch (error) {
    console.error("❌ Erro:", error.message);
    return ok([]);
  }
};

function parsePrice(value) {
  if (!value && value !== 0) return null;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[€$£\s]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function ok(data) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  };
}
