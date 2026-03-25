const fetch = require("node-fetch");

const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"]; // substitui pelos teus ASINs
const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const SECRET_KEY = process.env.AMAZON_SECRET_KEY;
const ASSOC_TAG = process.env.AMAZON_ASSOC_TAG;

exports.handler = async function(event, context) {
  try {
    // URL da API Amazon Product Advertising (simplificado)
    const products = await Promise.all(ASINS.map(async (asin) => {
      // Para cada ASIN, chamamos a API da Amazon
      // Aqui usamos um exemplo de URL; substitui pelo endpoint real da Amazon
      const url = `https://api.amazon.com/products?asin=${asin}&access_key=${ACCESS_KEY}&secret_key=${SECRET_KEY}&assoc_tag=${ASSOC_TAG}`;
      
      const res = await fetch(url);
      const data = await res.json();

      // Mapeia para o formato do HTML
      return {
        asin: asin,
        title: data.title || "Produto sem título",
        image: data.image || "https://via.placeholder.com/220",
        original_price: data.original_price || "",
        promo_price: data.promo_price || "",
        discount: data.discount || "",
        link: data.link || `https://www.amazon.com/dp/${asin}?tag=${ASSOC_TAG}`
      };
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products)
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Erro ao carregar produtos" }) };
  }
};
