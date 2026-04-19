<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ofertas Amazon – Melhores Promoções do Dia</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root {
    --amazon: #FF9900;
    --amazon-dark: #cc7a00;
    --red: #e53935;
    --bg: #0f0f0f;
    --surface: #1a1a1a;
    --surface2: #242424;
    --border: #2e2e2e;
    --text: #f0f0f0;
    --muted: #888;
    --radius: 14px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  /* ── HEADER ── */
  header {
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border-bottom: 1px solid var(--border);
    padding: 18px 20px 14px;
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: var(--amazon);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .logo-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 1px;
    color: var(--amazon);
    line-height: 1;
  }

  .logo-sub {
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .refresh-btn {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
  }
  .refresh-btn:hover { background: var(--border); }
  .refresh-btn:active { transform: scale(0.97); }

  /* ── BANNER ── */
  .banner {
    background: linear-gradient(90deg, #1a0a00, #2a1200, #1a0a00);
    border-bottom: 2px solid var(--amazon);
    padding: 10px 20px;
    text-align: center;
    font-size: 13px;
    color: var(--amazon);
    letter-spacing: 1px;
    font-weight: 700;
    text-transform: uppercase;
  }

  /* ── MAIN ── */
  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 16px 40px;
  }

  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 2px;
    color: var(--text);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-title span {
    color: var(--amazon);
  }

  /* ── GRID ── */
  .products {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  /* ── CARD ── */
  .product {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .product:hover {
    transform: translateY(-4px);
    border-color: var(--amazon);
    box-shadow: 0 8px 32px rgba(255,153,0,0.15);
  }

  .badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: var(--red);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    z-index: 2;
    letter-spacing: 0.5px;
  }

  .img-wrap {
    background: #fff;
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 10px;
  }
  .img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
  }
  .product:hover .img-wrap img { transform: scale(1.06); }

  .card-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .title {
    font-size: 13px;
    color: var(--text);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  .prices {
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex-wrap: wrap;
  }
  .price-original {
    text-decoration: line-through;
    color: var(--muted);
    font-size: 12px;
  }
  .price-promo {
    color: var(--amazon);
    font-weight: 700;
    font-size: 20px;
    line-height: 1;
  }

  .btn-buy {
    display: block;
    padding: 10px;
    background: var(--amazon);
    color: #000;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13px;
    text-align: center;
    text-decoration: none;
    letter-spacing: 0.3px;
    transition: background 0.2s, transform 0.1s;
  }
  .btn-buy:hover { background: var(--amazon-dark); }
  .btn-buy:active { transform: scale(0.98); }

  /* ── ESTADOS ── */
  .state-msg {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
    font-size: 15px;
  }

  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--amazon);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── FOOTER ── */
  footer {
    text-align: center;
    padding: 24px;
    color: var(--muted);
    font-size: 11px;
    border-top: 1px solid var(--border);
    line-height: 1.8;
  }
  footer a { color: var(--amazon); text-decoration: none; }

  /* ── MOBILE ── */
  @media (max-width: 480px) {
    .products { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .section-title { font-size: 22px; }
    .price-promo { font-size: 17px; }
  }
</style>
</head>
<body>

<header>
  <div class="logo-area">
    <div class="logo-icon">⚡</div>
    <div>
      <div class="logo-text">AmazonOfertas</div>
      <div class="logo-sub">Melhores promoções</div>
    </div>
  </div>
  <button class="refresh-btn" onclick="loadProducts()">
    🔄 Atualizar
  </button>
</header>

<div class="banner">
  ⚡ Promoções atualizadas diariamente — Aproveita antes que acabem!
</div>

<main>
  <div class="section-title">
    Ofertas de <span>Hoje</span>
  </div>

  <div class="products" id="products-container">
    <div class="state-msg">
      <div class="loader">
        <div class="spinner"></div>
        <span>A carregar promoções...</span>
      </div>
    </div>
  </div>
</main>

<footer>
  Como associado Amazon, ganho comissões em compras elegíveis.<br>
  Os preços podem variar. Confirma sempre o preço final na Amazon.<br>
  <a href="#">Política de Privacidade</a> · <a href="#">Contacto</a>
</footer>

<script>
async function loadProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = `
    <div class="state-msg">
      <div class="loader">
        <div class="spinner"></div>
        <span>A carregar promoções...</span>
      </div>
    </div>`;

  try {
    const res = await fetch("/.netlify/functions/amazon");

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const items = await res.json();
    container.innerHTML = "";

    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `
        <div class="state-msg">
          😕 Sem promoções disponíveis neste momento.<br>Volta mais tarde!
        </div>`;
      return;
    }

    items.forEach(item => {
      const hasDiscount = item.discount && item.discount > 0;
      const hasOriginal = item.original_price && item.original_price !== item.promo_price;

      container.insertAdjacentHTML("beforeend", `
        <div class="product">
          ${hasDiscount ? `<span class="badge">-${item.discount}%</span>` : ""}
          <div class="img-wrap">
            <img 
              src="${item.image || ''}" 
              alt="${item.title}" 
              onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>'"
            >
          </div>
          <div class="card-body">
            <div class="title">${item.title}</div>
            <div class="prices">
              ${hasOriginal ? `<span class="price-original">${Number(item.original_price).toFixed(2)} €</span>` : ""}
              ${item.promo_price ? `<span class="price-promo">${Number(item.promo_price).toFixed(2)} €</span>` : ""}
            </div>
            <a class="btn-buy" href="${item.link}" target="_blank" rel="noopener">
              🛒 Ver Oferta
            </a>
          </div>
        </div>`);
    });

  } catch (error) {
    console.error("Erro:", error);
    container.innerHTML = `
      <div class="state-msg">
        ⚠️ Erro ao carregar produtos.<br>
        <button class="refresh-btn" style="margin-top:12px" onclick="loadProducts()">
          🔄 Tentar novamente
        </button>
      </div>`;
  }
}

loadProducts();
</script>
</body>
</html>
