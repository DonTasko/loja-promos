import Paapi5 from "paapi5-nodejs-sdk";

export async function handler() {
  const client = new Paapi5.DefaultApi({
    accessKey: process.env.AMAZON_ACCESS_KEY,
    secretKey: process.env.AMAZON_SECRET_KEY,
    partnerTag: process.env.AMAZON_ASSOC_TAG,
    partnerType: "Associates",
    marketplace: "www.amazon.pt",
  });

  try {
    const response = await client.getItems({
      ItemIds: ["B0GHNL2SRS", "B0CVB937JQ"], // substitui pelos teus ASINs
      Resources: [
        "Images.Primary.Medium",
        "ItemInfo.Title",
        "Offers.Listings.Price"
      ]
    });

    const products = response.ItemsResult.Items.map(item => ({
      asin: item.ASIN,
      title: item.ItemInfo.Title.DisplayValue,
      image: item.Images.Primary.Medium.URL,
      original_price:
        item.Offers?.Listings?.[0]?.Price?.Amount?.toFixed(2) ?? null,
      promo_price:
        item.Offers?.Listings?.[0]?.Price?.Amount?.toFixed(2) ?? null,
      link: item.DetailPageURL,
      discount: null,
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(products),
    };

  } catch (error) {
    console.error("Erro Amazon PA API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos" }),
    };
  }
}
