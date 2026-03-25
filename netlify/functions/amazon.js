// amazon.js - Netlify Function
const { DefaultApi, Configuration } = require("@amzn/paapi5-nodejs-sdk");
const fetch = require("node-fetch");

const accessKey = process.env.AMAZON_ACCESS_KEY;
const secretKey = process.env.AMAZON_SECRET_KEY;
const partnerTag = process.env.AMAZON_ASSOC_TAG; // teu tag de afiliado
const marketplace = "www.amazon.pt"; // mercado PT

const client = new DefaultApi(
  new Configuration({
    accessKey,
    secretKey,
    host: "webservices.amazon.com",
    region: "eu-west-1"
  })
);

// Lista de ASINs
const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"]; // substitui pelos teus

exports.handler = async (event, context) => {
  try {
    const request = {
      ItemIds: ASINS,
      Resources: [
        "Images.Primary.Medium",
        "ItemInfo.Title",
        "Offers.Listings.Price",
        "Offers.Listings.Promotions"
      ],
      PartnerTag: partnerTag,
      PartnerType: "Associates",
      Marketplace: marketplace
    };

    const response = await client.getItems(request);

    // Transformar resposta em JSON simples para o front
    const items = response.ItemsResult.Items.map(item => {
      const offer = item.Offers?.Listings?.[0];
      const price = offer?.Price?.DisplayAmount || null;
      const promoPrice = offer?.Price?.Amount
        ? (offer.Price.Amount / 100).toFixed(2)
        : null;

      return {
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue || "Sem título",
        image: item.Images?.Primary?.Medium?.URL || "",
        original_price: price,
        promo_price: promoPrice,
        discount: null, // podes calcular se quiseres
        link: `https://www.amazon.pt/dp/${item.ASIN}?tag=${partnerTag}`
      };
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error("Erro Amazon PAAPI:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos." })
    };
  }
};
