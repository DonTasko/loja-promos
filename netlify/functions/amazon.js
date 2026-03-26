// netlify/functions/amazon.js

exports.handler = async (event, context) => {
  console.log("🔹 Função Amazon simplificada iniciada");

  try {
    // Produtos "mock" apenas para teste do front-end
    const items = [
      {
        asin: "B0GHNL2SRS",
        title: "Produto de Teste 1",
        image: "https://via.placeholder.com/220x220.png?text=Produto+1",
        original_price: 50.0,
        promo_price: 35.0,
        discount: 30,
        link: "https://www.amazon.pt/dp/B0GHNL2SRS?tag=teste-21"
      },
      {
        asin: "B0CVB937JQ",
        title: "Produto de Teste 2",
        image: "https://via.placeholder.com/220x220.png?text=Produto+2",
        original_price: 100.0,
        promo_price: 70.0,
        discount: 30,
        link: "https://www.amazon.pt/dp/B0CVB937JQ?tag=teste-21"
      }
    ];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error("❌ Erro na função simplificada:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos" })
    };
  }
};
