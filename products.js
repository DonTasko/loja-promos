import crypto from "crypto";

export default async function handler(req, res) {
  const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"];

  const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
  const SECRET_KEY = process.env.AMAZON_SECRET_KEY;
  const PARTNER_TAG = "viseu7302-21"; 
  const REGION = "eu-west-1"; 
  const HOST = "webservices.amazon.es";

  const endpoint = `https://${HOST}/paapi5/getitems`;

  const payload = {
    "ItemIds": ASINS,
    "Resources": [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Offers.Listings.SavingBasis.Price"
    ],
    "PartnerTag": PARTNER_TAG,
    "PartnerType": "Associates"
  };

  const payloadString = JSON.stringify(payload);

  // --- Amazon Signature V4 ---
  const now = new Date();
  const amzDate = now.toISOString().split('.')[0] + "Z";
  const dateStamp = amzDate.substring(0, 10).replace(/-/g, "");

  const canonicalUri = "/paapi5/getitems";
  const canonicalQueryString = "";
  const canonicalHeaders = 
  `content-type:application/json; charset=utf-8\n` +
  `host:${HOST}\n` +
  `x-amz-date:${amzDate}\n` +
  `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems\n`;

const signedHeaders = 
  "content-type;host;x-amz-date;x-amz-target";

  const hashPayload = crypto.createHash("sha256").update(payloadString).digest("hex");

  const canonicalRequest = 
    `POST\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashPayload}`;

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${REGION}/ProductAdvertisingAPI/aws4_request`;

  const stringToSign = 
    `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;

  function sign(key, msg) {
    return crypto.createHmac("sha256", key).update(msg).digest();
  }

  const kDate = sign(("AWS4" + SECRET_KEY), dateStamp);
  const kRegion = sign(kDate, REGION);
  const kService = sign(kRegion, "ProductAdvertisingAPI");
  const kSigning = sign(kService, "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  const authorizationHeader =
    `${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // --- Fetch Amazon ---
  const amazonResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Encoding": "amz-1.0",
      "X-Amz-Date": amzDate,
      "Authorization": authorizationHeader,
      "Host": HOST
    },
    body: payloadString
  });

  const data = await amazonResponse.json();

  const result = data.ItemsResult.Items.map(item => {
    const title = item.ItemInfo.Title.DisplayValue;
    const image = item.Images.Primary.Large.URL;

    const offer = item.Offers?.Listings?.[0] || null;

    const promoPrice = offer?.Price?.Amount || null;
    const originalPrice = offer?.SavingBasis?.Price?.Amount || promoPrice;

    const discountPct = originalPrice && promoPrice
      ? Math.round(((originalPrice - promoPrice) / originalPrice) * 100)
      : 0;

    return {
      asin: item.ASIN,
      title,
      image,
      original_price: originalPrice,
      promo_price: promoPrice,
      discount: discountPct,
      link: `https://www.amazon.es/dp/${item.ASIN}/?tag=${PARTNER_TAG}`
    };
  });

  res.status(200).json(result);
}
