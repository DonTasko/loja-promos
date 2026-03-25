// netlify-functions/amazon.js

exports.handler = async function(event, context) {
  // Lê as variáveis do Netlify
  const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
  const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY;
  const AMAZON_ASSOC_TAG = process.env.AMAZON_ASSOC_TAG; // se estiver a usar Amazon Affiliates

  // Confirma se as variáveis estão definidas
  if (!AMAZON_ACCESS_KEY || !AMAZON_SECRET_KEY || !AMAZON_ASSOC_TAG) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Chaves da Amazon não definidas no Netlify.' })
    };
  }

  try {
    // Lista de ASINs (substitui pelos teus)
    const ASINS = [
      'B09XYZ1234',
      'B08ABC5678',
      'B07DEF9101'
    ];

    // Aqui podes adicionar lógica real de API da Amazon, mas por enquanto devolvemos dados de exemplo
    const products = ASINS.map(asin => ({
      asin,
      title: `Produto de exemplo ${asin}`,
      price: '€99',
      discount: '-50%',
      image: `https://via.placeholder.com/200?text=${asin}`, // depois substitui pela imagem real
      url: `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOC_TAG}`
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ products })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao carregar produtos.' })
    };
  }
};
