// netlify/functions/amazon.js
const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    // Aqui vais buscar os dados da tua Google Sheets
    // Exemplo com Google Sheets API:
    const sheetUrl = 'https://script.google.com/macros/s/AKfycbzXV2COi6q6327Son0xN9pXKK3vWkmMc0FRp6m25MXzJsBbqg80GAR_qvNhP9pFW9JzWA/exec';
    const response = await axios.get(sheetUrl);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao carregar produtos' })
    };
  }
};
