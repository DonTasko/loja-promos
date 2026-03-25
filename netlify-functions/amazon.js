// netlify/functions/amazon.js
import fetch from "node-fetch";

export async function handler(event, context) {
  const ASINS = ["ASIN1", "ASIN2"]; // substitui pelos teus ASINs

  const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
  const SECRET_KEY = process.env.AMAZON_SECRET_KEY;
  const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG;

  if (!ACCESS_KEY || !SECRET_KEY || !ASSOCIATE_TAG) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Chaves Amazon não configuradas!" }),
    };
  }

  try {
    // Exemplo simples: a Amazon Product Advertising API requer assinatura, aqui é só para testar
    // Vamos simular dados:
    const produtos = ASINS.map((asin, i) => ({
      asin,
      title: `Produto de teste ${i + 1}`,
      link: `https://www.amazon.com/dp/${asin}?tag=${ASSOCIATE_TAG}`,
      price: `$${(10 + i * 5).toFixed(2)}`,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(produtos),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
