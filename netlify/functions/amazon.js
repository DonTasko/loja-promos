// netlify/functions/amazon.js
const AmazonPaapi = require('amazon-paapi'); // usa a versão oficial
require('dotenv').config();

const config = {
  accessKey: process.env.AMAZON_ACCESS_KEY,
  secretKey: process.env.AMAZON_SECRET_KEY,
  partnerTag: process.env.AMAZON_ASSOC_TAG,
  marketplace: 'www.amazon.pt',
  region: 'eu-west-1'
};

exports.handler = async (event, context) => {
  console.log("📌 Função Amazon iniciada");
  
  // ASINs que queres mostrar
  const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"];

  try {
    console.log("🔹 Criando request para Amazon PA API com os ASINs:", ASINS);

    const data = await AmazonPaapi.GetItems({
      ItemIds: ASINS,
      Resources: [
        'Images.Primary.Large',
        'ItemInfo.Title',
        'Offers.Listings.Price'
      ],
      ...config
    });

    console.log("✅ Resposta da Amazon recebida:");
    console.log(JSON.stringify(data, null, 2));

    // Processa os produtos para enviar ao front-end
    const items = data.ItemsResult.Items.map(item => ({
      asin: item.ASIN,
      title: item.ItemInfo.Title.DisplayValue,
      image: item.Images.Primary.Large.URL,
      original_price: item.Offers?.Listings?.[0]?.Price?.Amount ? item.Offers.Listings[0].Price.Amount.toFixed(2) : null,
      promo_price: item.Offers?.Listings?.[0]?.Price?.Amount ? item.Offers.Listings[0].Price.Amount.toFixed(2) : null,
      discount: null, // pode calcular depois se quiser
      link: `https://www.amazon.pt/dp/${item.ASIN}?tag=${config.partnerTag}`
    }));

    console.log("🔹 Produtos processados para front-end:");
    console.log(items);

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };

  } catch (error) {
    console.error("❌ Erro ao carregar produtos da Amazon:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos da Amazon" })
    };
  }
};
