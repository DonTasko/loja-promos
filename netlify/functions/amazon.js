const amazonPaapi = require('amazon-paapi');

exports.handler = async () => {
  try {
    const client = new amazonPaapi.DefaultApiClient({
      accessKey: process.env.AMAZON_ACCESS_KEY,
      secretKey: process.env.AMAZON_SECRET_KEY,
      partnerTag: process.env.AMAZON_ASSOC_TAG,
      marketplace: 'www.amazon.pt', // mercado PT
    });

    const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"]; // coloca os teus ASINs aqui

    const response = await client.getItems({ ItemIds: ASINS });

    // Mapeia os produtos para o frontend
    const items = response.ItemsResult.Items.map(item => ({
      asin: item.ASIN,
      title: item.ItemInfo.Title.DisplayValue,
      image: item.Images.Primary.Medium.URL,
      link: item.DetailPageURL,
      original_price: item.Offers?.Listings?.[0]?.Price?.Amount,
      promo_price: item.Offers?.Listings?.[0]?.Price?.Amount,
      discount: null // a API não devolve desconto diretamente
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };

  } catch (error) {
    console.error("Erro Amazon PA API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos" }),
    };
  }
};
