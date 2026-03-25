const fetch = require("node-fetch"); // se precisares de node-fetch

exports.handler = async function(event, context) {
  const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"]; // os teus ASINs
  const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
  const SECRET_KEY = process.env.AMAZON_SECRET_KEY;
  const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG;

  try {
    // Exemplo de chamada simplificada – aqui precisas de usar a Amazon PA API real
    // Por enquanto devolvemos dados de teste
    const items = ASINS.map(asin => ({
      asin,
      title: `Produto ${asin}`,
      link: `https://www.amazon.com/dp/${asin}?tag=${ASSOCIATE_TAG}`,
      image: "https://via.placeholder.com/220",
      original_price: "20 €",
      price: "15 €",
      discount: "25"
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos." })
    };
  }
};
