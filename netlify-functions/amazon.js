import AmazonPaapi from "amazon-paapi";

const client = new AmazonPaapi({
  accessKey: process.env.AMAZON_ACCESS_KEY,
  secretKey: process.env.AMAZON_SECRET_KEY,
  partnerTag: process.env.AMAZON_ASSOC_TAG,
  partnerType: "Associates",
  marketplace: "www.amazon.pt"
});

export async function handler(event, context) {
  try {
    const response = await client.getItems({
      ItemIds: ["B0GHNL2SRS", "B0CVB937JQ"], // substitui pelos teus ASINs
      Resources: [
        "Images.Primary.Small",
        "ItemInfo.Title",
        "Offers.Listings.Price"
      ]
    });

    const products = response.ItemsResult.Items.map(item => ({
      asin: item.ASIN,
      title: item.ItemInfo.Title.DisplayValue,
      image: item.Images.Primary.Small.URL,
      original_price: item.Offers?.Listings?.[0]?.Price?.Amount ? (item.Offers.Listings[0].Price.Amount).toFixed(2) : null,
      promo_price: item.Offers?.Listings?.[0]?.Price?.Amount ? (item.Offers.Listings[0].Price.Amount).toFixed(2) : null,
      link: `https://www.amazon.pt/dp/${item.ASIN}`,
      discount: null
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
      headers: { "Content-Type": "application/json" }
    };

  } catch (error) {
    console.error("Erro Amazon API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos" }),
      headers: { "Content-Type": "application/json" }
    };
  }
}
