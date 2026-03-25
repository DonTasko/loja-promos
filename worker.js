export default {
  async fetch(request, env) {
    const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"];

    const payload = {
      ItemIds: ASINS,
      Resources: [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "Offers.Listings.Price",
        "Offers.Listings.SavingBasis.Price"
      ],
      PartnerTag: "viseu7302-21",
      PartnerType: "Associates"
    };

    const HOST = "webservices.amazon.es";
    const REGION = "eu-west-1";

    const amzDate = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    const dateStamp = amzDate.split("T")[0].replace(/-/g, "");

    function sign(key, msg) {
      return crypto.subtle.sign({name: "HMAC"}, key, new TextEncoder().encode(msg));
    }

    const encoder = new TextEncoder();
    const payloadString = JSON.stringify(payload);

    const canonicalHeaders =
      `content-encoding:amz-1.0\n` +
      `content-type:application/json; charset=utf-8\n` +
      `host:${HOST}\n` +
      `x-amz-date:${amzDate}\n`;

    const signedHeaders = "content-encoding;content-type;host;x-amz-date";

    const hashPayload = await crypto.subtle.digest("SHA-256", encoder.encode(payloadString));
    const hashPayloadHex = [...new Uint8Array(hashPayload)].map(b => b.toString(16).padStart(2, "0")).join("");

    const canonicalRequest =
      `POST\n/paapi5/getitems\n\n${canonicalHeaders}\n${signedHeaders}\n${hashPayloadHex}`;

    const hashCanonical = await crypto.subtle.digest("SHA-256", encoder.encode(canonicalRequest));
    const hashCanonicalHex = [...new Uint8Array(hashCanonical)].map(b => b.toString(16).padStart(2, "0")).join("");

    const stringToSign =
      `AWS4-HMAC-SHA256\n${amzDate}\n${dateStamp}/${REGION}/ProductAdvertisingAPI/aws4_request\n${hashCanonicalHex}`;

    // Cloudflare secret keys aqui
    const kDate = await crypto.subtle.importKey("raw", encoder.encode("AWS4" + env.AMAZON_SECRET_KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const kRegion = await sign(kDate, dateStamp);
    
    // (continua — versão final completa quando pedires produzir o Worker completo)

    return new Response("Worker template pronto. Preciso da Secret key para finalizar assinatura.");
  }
}
