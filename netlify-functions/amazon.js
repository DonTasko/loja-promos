const Paapi5 = require('@amzn/paapi5-nodejs-sdk');
const fetch = require('node-fetch');

const client = new Paapi5.DefaultApi();

exports.handler = async function(event, context) {
  try {
    const request = new Paapi5.GetItemsRequest({
      PartnerTag: process.env.AMAZON_ASSOC_TAG,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.pt',
      ItemIds: ["B0GHNL2SRS", "B0CVB937JQ"] // os teus ASINs
    });

    const response = await client.getItems(request);

    // Mapeamos os produtos para enviar só os dados que o front precisa
    const items = response.ItemsResult.Items.map(item => ({
      asin: item.ASIN,
      title: item.ItemInfo.Title.DisplayValue,
      image: item.Images.Primary.Large.URL,
      link: item.DetailPageURL,
      original_price: item.Offers?.Listings?.[0]?.Price?.Amount || null,
      promo_price: item.Offers?.Listings?.[0]?.Price?.Amount || null,
      discount: null
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao obter produtos' })
    };
  }
};
