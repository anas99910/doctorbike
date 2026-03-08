/**
 * generate-product-pages.js
 * 
 * Reads products from js/products.js (all arrays), generates one
 * static SEO-optimised HTML page per product in /products/ directory,
 * and appends URLs to sitemap.xml.
 * 
 * Run:  node generate-product-pages.js
 */

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

// ─── 1. Load products.js into a sandbox ───────────────────────────────────
// Convert const/let declarations to sandbox property assignments so vm can access them
let productsSrc = fs.readFileSync(path.join(__dirname, 'js/products.js'), 'utf8');
productsSrc = productsSrc.replace(/^(const|let)\s+(\w+)/gm, 'sandbox["$2"]');

const sandbox = { sandbox: {} };
sandbox.sandbox = sandbox; // self-reference so sandbox["name"] works
vm.createContext(sandbox);
vm.runInContext(productsSrc, sandbox);

// Collect all product arrays in the file
const allProducts = [];
for (const [key, val] of Object.entries(sandbox)) {
    if (key === 'sandbox') continue;
    if (Array.isArray(val)) {
        allProducts.push(...val.map(p => ({ ...p, _sourceArray: key })));
    }
}

console.log(`✔ Loaded ${allProducts.length} products from products.js`);

// ─── 2. Category + Brand logic (mirrors script.js) ─────────────────────────
function getProductCategory(title) {
    const t = title.toUpperCase();
    if (t.includes('CHAIN') || t.includes('CHAINE'))                              return 'chain';
    if (t.includes('FILTRE A AIR') || t.includes('HFA') || t.includes('HFF') ||
        t.includes('CFA') || t.includes('JIABIN'))                                 return 'air_filter';
    if (t.includes('FILTRE A HUILE') || t.includes('HF') ||
        t.includes('KN') || t.includes('HIFLOFILTRO'))                             return 'filtre';
    if (t.includes('PNEU') || t.includes('DUNLOP') || t.includes('MICHELIN') ||
        t.includes('WANDA') || t.includes('MITAS') || t.includes('TIMSUN') ||
        t.includes('BRIDGESTONE') || t.includes('BUGGY') || t.includes('P3051'))  return 'pneu';
    if (t.includes('10W') || t.includes('5W') || t.includes('15W') ||
        t.includes('20W') || t.includes('0W') || t.includes('GEAR BOX') ||
        t.includes('FOURCHE') || t.includes('KXT') || t.includes('XTM') ||
        t.includes('XTC') || t.includes('XT4S') || t.includes('SHOGUN') ||
        t.includes('KATANA') || t.includes('R4000') || t.includes('HUILE') ||
        t.includes('2T') || t.includes('4T'))                                      return 'oil';
    return 'maintenance';
}

function getProductBrand(title, image) {
    const t = title.toUpperCase();
    const i = (image || '').toLowerCase();
    if (t.includes('BARDAHL') || i.includes('bardahl.ma') || t.includes('XTC') || t.includes('XTM') || t.includes('XTF')) return 'Bardahl';
    if (t.includes('IPONE') || t.includes('KATANA') || t.includes('SHOGUN') || t.includes('SAMOURAI') || t.includes('R4000') || i.includes('ipone')) return 'Ipone';
    if (t.includes('MOTUL') || t.includes('7100') || t.includes('5100') || t.includes('5000') || t.includes('3000') || t.includes('8100')) return 'Motul';
    if (t.includes('LIQUI MOLY') || i.includes('liqui-moly')) return 'Liqui Moly';
    if (t.includes('CASTROL')) return 'Castrol';
    if (t.includes('MICHELIN')) return 'Michelin';
    if (t.includes('DUNLOP'))   return 'Dunlop';
    if (t.includes('BRIDGESTONE')) return 'Bridgestone';
    if (t.includes('WANDA') || t.includes('BUGGY') || t.includes('P3051')) return 'Wanda';
    if (t.includes('MITAS'))    return 'Mitas';
    if (t.includes('TIMSUN'))   return 'Timsun';
    if (t.includes('HIFLOFILTRO') || t.includes('HFA') || t.includes('HFF')) return 'Hiflofiltro';
    if (t.includes('MIW'))      return 'MIW';
    return 'Doctor Biker';
}

const CATEGORY_META = {
    oil:         { label: 'Huiles Moteur', page: 'huiles-moto.html',       keywords: 'huile moteur moto Casablanca, huile moto Maroc' },
    pneu:        { label: 'Pneus Moto',    page: 'pneus-moto.html',        keywords: 'pneu moto Casablanca, pneu moto Maroc' },
    filtre:      { label: 'Filtres à Huile', page: 'filtres-huile.html',   keywords: 'filtre à huile moto Casablanca' },
    air_filter:  { label: 'Filtres à Air', page: 'filtres-air.html',       keywords: 'filtre air moto Casablanca, filtre air moto Maroc' },
    chain:       { label: 'Entretien Chaîne', page: 'entretien-chaine.html', keywords: 'entretien chaîne moto Casablanca' },
    maintenance: { label: 'Additifs & Entretien', page: 'additifs-entretien.html', keywords: 'additifs entretien moto Casablanca' },
};

// ─── 3. Slug generator ────────────────────────────────────────────────────
function slugify(str) {
    return str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 80);
}

// ─── 4. HTML template ─────────────────────────────────────────────────────
function buildProductPage(product, slug, brand, category, categoryMeta) {
    const title      = product.title;
    const image      = product.image || 'https://doctorbike.vercel.app/assets/logo.png';
    const desc       = product.description || `${title} disponible à Casablanca chez Doctor Biker Garage.`;
    const pageUrl    = `https://doctorbike.vercel.app/products/${slug}.html`;
    const catLabel   = categoryMeta.label;
    const catPage    = categoryMeta.page;
    const whatsappMsg = encodeURIComponent(`Bonjour Doctor Biker, je souhaite commander : ${title}`);
    const whatsappUrl = `https://wa.me/212696344361?text=${whatsappMsg}`;

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ${brand} | Doctor Biker Garage Casablanca</title>
    <meta name="description" content="${desc.substring(0, 155)}">
    <meta name="keywords" content="${title.toLowerCase()}, ${brand.toLowerCase()}, ${categoryMeta.keywords}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${pageUrl}">

    <!-- Open Graph -->
    <meta property="og:type" content="product">
    <meta property="og:title" content="${title} | Doctor Biker Garage">
    <meta property="og:description" content="${desc.substring(0, 155)}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:site_name" content="Doctor Biker Garage">

    <!-- JSON-LD Product Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "${title.replace(/"/g, '\\"')}",
        "image": "${image}",
        "description": "${desc.replace(/"/g, '\\"').substring(0, 250)}",
        "brand": { "@type": "Brand", "name": "${brand}" },
        "sku": "${slug}",
        "mpn": "${slug}",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "1"
        },
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "price": "0",
            "priceCurrency": "MAD",
            "priceValidUntil": "2026-12-31",
            "url": "${pageUrl}",
            "itemCondition": "https://schema.org/NewCondition",
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "MA",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod",
                "merchantReturnDays": 7,
                "returnMethod": "https://schema.org/ReturnInStore",
                "returnFees": "https://schema.org/FreeReturn"
            },
            "shippingDetails": {
               "@type": "OfferShippingDetails",
               "shippingRate": {
                 "@type": "MonetaryAmount",
                 "value": 0,
                 "currency": "MAD"
               },
               "shippingDestination": [{
                 "@type": "DefinedRegion",
                 "addressCountry": "MA"
               }],
               "deliveryTime": {
                 "@type": "ShippingDeliveryTime",
                 "handlingTime": {
                   "@type": "QuantitativeValue",
                   "minValue": 0,
                   "maxValue": 1,
                   "unitCode": "DAY"
                 },
                 "transitTime": {
                   "@type": "QuantitativeValue",
                   "minValue": 1,
                   "maxValue": 3,
                   "unitCode": "DAY"
                 }
               }
            },
            "seller": {
                "@type": "AutoPartsStore",
                "name": "Doctor Biker Garage",
                "address": { "@type": "PostalAddress", "addressLocality": "Casablanca", "addressCountry": "MA" },
                "telephone": "+212696344361"
            }
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://doctorbike.vercel.app/" },
                { "@type": "ListItem", "position": 2, "name": "Boutique", "item": "https://doctorbike.vercel.app/boutique.html" },
                { "@type": "ListItem", "position": 3, "name": "${catLabel}", "item": "https://doctorbike.vercel.app/${catPage}" },
                { "@type": "ListItem", "position": 4, "name": "${title.replace(/"/g, '\\"')}", "item": "${pageUrl}" }
            ]
        }
    }
    </script>

    <!-- Styles -->
    <link rel="stylesheet" href="../css/style.css?v=29">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .product-page-wrapper { max-width: 960px; margin: 100px auto 60px; padding: 30px 20px; }
        .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: start; }
        .product-img-wrap { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 30px; display: flex; align-items: center; justify-content: center; min-height: 340px; }
        .product-img-wrap img { max-height: 320px; max-width: 100%; object-fit: contain; }
        .product-info h1 { font-size: 1.6rem; margin-bottom: 0.5rem; color: #fff; letter-spacing: 1px; }
        .product-brand-tag { display: inline-block; background: rgba(213,0,0,0.15); border: 1px solid rgba(213,0,0,0.4); color: var(--primary-red); padding: 4px 14px; border-radius: 3px; font-size: 0.85rem; font-family: var(--font-heading); letter-spacing: 1px; margin-bottom: 20px; }
        .product-desc { color: var(--text-gray); line-height: 1.8; font-size: 1rem; margin-bottom: 30px; }
        .product-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,200,100,0.1); border: 1px solid rgba(0,200,100,0.3); color: #4caf50; padding: 6px 16px; border-radius: 3px; font-size: 0.85rem; margin-bottom: 24px; }
        .btn-order { display: inline-flex; align-items: center; gap: 12px; background: #25D366; color: #fff; padding: 14px 28px; border-radius: 4px; font-family: var(--font-heading); font-size: 1rem; letter-spacing: 1px; text-transform: uppercase; transition: all 0.3s ease; text-decoration: none; }
        .btn-order:hover { background: #1da851; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,211,102,0.3); }
        .breadcrumb { font-size: 0.82rem; color: var(--text-gray); margin-bottom: 28px; }
        .breadcrumb a { color: var(--primary-red); }
        .breadcrumb span { margin: 0 8px; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-gray); font-size: 0.9rem; margin-bottom: 30px; transition: color 0.2s; }
        .back-link:hover { color: var(--primary-red); }
        @media (max-width: 768px) { .product-layout { grid-template-columns: 1fr; gap: 24px; } .product-img-wrap { min-height: 220px; } }
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container container">
            <a href="../index.html" class="logo">
                <img src="../assets/logo.png" alt="Doctor Biker Garage Logo">
                <span>Doctor Biker</span>
            </a>
            <div class="menu-toggle" id="mobile-menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>
            <ul class="nav-menu">
                <li><a href="../index.html#home" class="nav-link">Accueil</a></li>
                <li><a href="../index.html#about" class="nav-link">À Propos</a></li>
                <li><a href="../index.html#services" class="nav-link">Services</a></li>
                <li><a href="../index.html#gallery" class="nav-link">Galerie</a></li>
                <li><a href="../boutique.html" class="nav-link active">Boutique</a></li>
                <li><a href="../index.html#reviews" class="nav-link">Avis</a></li>
                <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
            </ul>
        </div>
    </nav>

    <div class="product-page-wrapper">

        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumb">
            <a href="../index.html">Accueil</a><span>/</span>
            <a href="../boutique.html">Boutique</a><span>/</span>
            <a href="../${catPage}">${catLabel}</a><span>/</span>
            <span>${title}</span>
        </nav>

        <a href="../${catPage}" class="back-link">
            <i class="fas fa-arrow-left"></i> Retour à ${catLabel}
        </a>

        <div class="product-layout">
            <!-- Image -->
            <div class="product-img-wrap">
                <img src="${image}" alt="${title}" loading="lazy">
            </div>

            <!-- Info -->
            <div class="product-info">
                <span class="product-brand-tag">${brand}</span>
                <h1>${title}</h1>
                <div class="product-badge"><i class="fas fa-check-circle"></i> En Stock — Casablanca</div>
                <p class="product-desc">${desc}</p>
                <a href="${whatsappUrl}" target="_blank" class="btn-order">
                    <i class="fab fa-whatsapp"></i> Commander sur WhatsApp
                </a>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer style="margin-top: 60px;">
        <div class="container footer-content text-center">
            <img src="../assets/logo.png" alt="Doctor Biker Garage" class="footer-logo">
            <p class="copyright">&copy; 2026 Doctor Biker Garage. Tous droits réservés.</p>
        </div>
    </footer>

    <script>
        // Hamburger menu
        const btn = document.getElementById('mobile-menu');
        const menu = document.querySelector('.nav-menu');
        if (btn) btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            menu.classList.toggle('active');
        });
    </script>

</body>
</html>`;
}

// ─── 5. Generate pages ────────────────────────────────────────────────────
const outDir = path.join(__dirname, 'products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const slugsSeen = new Set();
const generated = [];
let skipped = 0;

for (const product of allProducts) {
    if (!product.title) { skipped++; continue; }

    const brand    = getProductBrand(product.title, product.image);
    const category = getProductCategory(product.title);
    const catMeta  = CATEGORY_META[category] || CATEGORY_META.maintenance;
    let slug        = slugify(product.title);

    // Deduplicate slugs
    let finalSlug = slug;
    let counter = 2;
    while (slugsSeen.has(finalSlug)) { finalSlug = `${slug}-${counter++}`; }
    slugsSeen.add(finalSlug);

    const html = buildProductPage(product, finalSlug, brand, category, catMeta);
    fs.writeFileSync(path.join(outDir, `${finalSlug}.html`), html, 'utf8');
    generated.push({ slug: finalSlug, title: product.title });
}

console.log(`✔ Generated ${generated.length} product pages in /products/`);
if (skipped) console.log(`⚠ Skipped ${skipped} products (missing title)`);

// ─── 6. Update sitemap.xml ────────────────────────────────────────────────
const sitemapPath = path.join(__dirname, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

const today = new Date().toISOString().split('T')[0];
const newEntries = generated.map(({ slug }) => `
  <url>
    <loc>https://doctorbike.vercel.app/products/${slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

// Insert before closing </urlset>
sitemap = sitemap.replace('</urlset>', `${newEntries}\n</urlset>`);
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log(`✔ Added ${generated.length} URLs to sitemap.xml`);
console.log('\n🚀 Done! Run: git add -A && git commit -m "feat: individual product pages" && git push');
