// netlify/functions/amazon.js

const Paapi = require('paapi5-nodejs-sdk');

const accessKey = process.env.AMAZON_ACCESS_KEY;
const secretKey = process.env.AMAZON_SECRET_KEY;
const partnerTag = process.env.AMAZON_ASSOC_TAG;

const client = new Paapi.DefaultApi(
  new Paapi.Configuration({
    accessKey,
    secretKey,
    region: "eu-west-1",
    host: "webservices.amazon.com"
  })
);

// ASINs reais
const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"];

exports.handler = async () => {
  try {
    const request = {
      ItemIds: ASINS,
      PartnerTag: partnerTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.pt",
      Resources: [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "Offers.Listings.Price"
      ]
    };

    const response = await client.getItems(request);

    const items = response.ItemsResult.Items.map(item => {
      const price = item.Offers?.Listings?.[0]?.Price;

      return {
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue || "Sem título",
        image: item.Images?.Primary?.Large?.URL || "",
        original_price: price?.Savings ? price.Savings.Amount : null,
        promo_price: price?.Amount ? price.Amount : null,
        discount: price?.Savings?.Percentage || null,
        link: `https://www.amazon.pt/dp/${item.ASIN}?tag=${partnerTag}`
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (err) {
    console.error("Erro PAAPI:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos" })
    };
  }
};
