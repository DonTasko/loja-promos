const crypto = require("crypto");

const accessKey = process.env.AMAZON_ACCESS_KEY;
const secretKey = process.env.AMAZON_SECRET_KEY;
const partnerTag = process.env.AMAZON_ASSOC_TAG;

const endpoint = "webservices.amazon.com";
const region = "eu-west-1";
const host = endpoint;
const uri = "/paapi5/getitems";

const ASINS = ["B0GHNL2SRS", "B0CVB937JQ"]; // <-- teus ASINs

// Função para assinatura AWS Signature V4
function sign(key, msg) {
  return crypto.createHmac("sha256", key).update(msg).digest();
}
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = sign("AWS4" + key, dateStamp);
  const kRegion = sign(kDate, regionName);
  const kService = sign(kRegion, serviceName);
  const kSigning = sign(kService, "aws4_request");
  return kSigning;
}

exports.handler = async () => {
  const requestPayload = {
    ItemIds: ASINS,
    Resources: [
      "Images.Primary.Medium",
      "ItemInfo.Title",
      "Offers.Listings.Price"
    ],
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: "www.amazon.pt"
  };

  const method = "POST";
  const service = "ProductAdvertisingAPI";
  const contentType = "application/json; charset=UTF-8";

  const payload = JSON.stringify(requestPayload);
  const amzdate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const datestamp = amzdate.slice(0, 8);

  const canonicalRequest = [
    method,
    uri,
    "",
    `content-encoding:amz-1.0\ncontent-type:${contentType}\nhost:${host}\nx-amz-date:${amzdate}`,
    "content-encoding;content-type;host;x-amz-date",
    crypto.createHash("sha256").update(payload).digest("hex")
  ].join("\n");

  const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzdate,
    credentialScope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex")
  ].join("\n");

  const signingKey = getSignatureKey(secretKey, datestamp, region, service);
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=content-encoding;content-type;host;x-amz-date, Signature=${signature}`;

  try {
    const response = await fetch(`https://${host}${uri}`, {
      method: method,
      headers: {
        "Content-Encoding": "amz-1.0",
        "Content-Type": contentType,
        "Host": host,
        "X-Amz-Date": amzdate,
        "Authorization": authorizationHeader
      },
      body: payload
    });

    const data = await response.json();

    const items = (data.ItemsResult?.Items || []).map(item => {
      const listing = item.Offers?.Listings?.[0];
      return {
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue || "Sem título",
        image: item.Images?.Primary?.Medium?.URL || "",
        price: listing?.Price?.DisplayAmount || null,
        link: `https://www.amazon.pt/dp/${item.ASIN}?tag=${partnerTag}`
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (err) {
    console.error("Erro PAAPI:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao carregar produtos." })
    };
  }
};
