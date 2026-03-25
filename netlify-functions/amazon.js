// Exemplo básico
export async function handler(event, context) {
  try {
    const data = await fetchAmazonProducts(ASINs); // tua função que usa keys
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
