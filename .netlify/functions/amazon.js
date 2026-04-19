exports.handler = async function (event, context) {
  const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbzXV2COi6q6327Son0xN9pXKK3vWkmMc0FRp6m25MXzJsBbqg80GAR_qvNhP9pFW9JzWA/exec";

  try {
    const response = await fetch(SHEET_URL, { redirect: "follow" });
    const text = await response.text();

    // Devolve tudo em bruto para diagnóstico
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        status: response.status,
        ok: response.ok,
        raw_length: text.length,
        first_500_chars: text.substring(0, 500),
        is_array: text.trim().startsWith("["),
        is_object: text.trim().startsWith("{"),
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
