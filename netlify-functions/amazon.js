// netlify/functions/amazon.js
// Fonte de dados: Google Apps Script (Google Sheets)
// Sem dependências externas - usa fetch nativo do Node 18+

exports.handler = async function (event, context) {
  const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbzXV2COi6q6327Son0xN9pXKK3vWkmMc0FRp6m25MXzJsBbqg80GAR_qvNhP9pFW9JzWA/exec";

  try {
    const response = await fetch(SHEET_URL);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Normaliza: aceita array direto ou { items: [...] }
    let items = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (Array.isArray(data?.items)) {
      items = data.items;
    } else if (Array.isArray(data?.products)) {
      items = data.products;
    }

    // Garante que cada item tem os campos esperados pelo index.html
    const normalized = items.map((item) => ({
      asin: item.asin || item.id || "",
      title: item.title || item.titulo || "Sem título",
      image: item.image || item.imagem || item.img || "",
      original_price: item.original_price ?? item.preco_original ?? item.price ?? null,
      promo_price: item.promo_price ?? item.preco_promo ?? item.price ?? null,
      discount: item.discount ?? item.desconto ?? 0,
      link: item.link || item.url || "#",
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(normalized),
    };
  } catch (error) {
    console.error("❌ Erro na função amazon:", error.message);

    // Devolve array vazio em vez de 500 — o front-end mostra "Sem produtos"
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify([]),
    };
  }
};
