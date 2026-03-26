import crypto from "crypto";

export default async function handler(req, res) {
  const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"];

  const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
  const SECRET_KEY = process.env.AMAZON_SECRET_KEY;
  const PARTNER_TAG = "viseu7302-21";

  const REGION = "eu-west-1";
  const SERVICE = "ProductAdvertisingAPI";
  const HOST = "webservices.amazon.es";
  const ENDPOINT = `https://${HOST}/paapi5/getitems`;

  const payload = {
    ItemIds: ASINS,
    PartnerTag: PARTNER_TAG,
    PartnerType: "Associates",
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Offers.Listings.SavingBasis.Price"
    ]
  };

  const payloadString = JSON.stringify(payload);

  // ------- AWS SIGNATURE V4 ----------
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const canonicalUri = "/paapi5/getitems";
  const canonicalQueryString = "";

  const canonicalHeaders =
    `content-type:application/json; charset=utf-8\n` +
    `host:${HOST}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems\n`;

  const signedHeaders = "content-type;host;x-amz-date;x-amz-target";

  const payloadHash = crypto.createHash("sha256").update(payloadString).digest("hex");

  const canonicalRequest =
    `POST\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;

  const stringToSign =
    `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;

  function sign(key, msg) {
    return crypto.createHmac("sha256", key).update(msg).digest();
  }

  const kDate = sign(Buffer.from("AWS4" + SECRET_KEY, "utf-8"), dateStamp);
  const kRegion = sign(kDate, REGION);
  const kService = sign(kRegion, SERVICE);
  const kSigning = sign(kService, "aws4_request");

  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  const authorizationHeader =
    `${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // ----------- Fetch Amazon ------------
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Amz-Date": amzDate,
      "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
      "Authorization": authorizationHeader,
      "Host": HOST
    },
    body: payloadString
  });

  const data = await response.json();

  if (data.Errors) {
    console.error("Amazon API Error:", data.Errors);
    return res.status(500).json({ error: "Amazon API error", details: data.Errors });
  }

  const items = data.ItemsResult.Items.map(item => {
    const title = item.ItemInfo.Title.DisplayValue;
    const image = item.Images.Primary.Large.URL;

    const offer = item.Offers?.Listings?.[0] || null;
    const promo = offer?.Price?.Amount || null;
    const original = offer?.SavingBasis?.Price?.Amount || promo;

    const discount =
      original && promo
        ? Math.round(((original - promo) / original) * 100)
        : 0;

    return {
      asin: item.ASIN,
      title,
      image,
      original_price: original,
      promo_price: promo,
      discount,
      link: `https://www.amazon.es/dp/${item.ASIN}/?tag=${PARTNER_TAG}`
    };
  });

  return res.status(200).json(items);
}
