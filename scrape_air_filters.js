const axios = require('axios');
const { JSDOM } = require('jsdom');
const fs = require('fs');

async function scrapePages() {
    const urls = [
        "https://www.motoshop.ma/shop/category/entretien-pieces-d-usure-filtres-filtres-a-air-90",
        "https://www.motoshop.ma/shop/category/entretien-pieces-d-usure-filtres-filtres-a-air-90/page/2"
    ];
    let newProducts = [];

    for (const url of urls) {
        console.log(`Fetching ${url}...`);
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const dom = new JSDOM(response.data);
            const document = dom.window.document;

            // On motoshop.ma, products are usually in .oe_product or .oe_product_cart or .product-item
            const productElements = document.querySelectorAll('.oe_product');

            productElements.forEach(el => {
                const imgTag = el.querySelector('img[itemprop="image"]');
                const titleTag = el.querySelector('[itemprop="name"]');

                if (imgTag && titleTag) {
                    const title = titleTag.textContent.trim();
                    let imgUrl = imgTag.getAttribute('src');
                    if (imgUrl && !imgUrl.startsWith('http')) {
                        imgUrl = "https://www.motoshop.ma" + imgUrl;
                    }

                    if (title && imgUrl && !newProducts.find(p => p.title === title)) {
                        newProducts.push({ title, image: imgUrl });
                    }
                }
            });
        } catch (e) {
            console.error("Error fetching", url, e.message);
        }
    }

    console.log(`Found ${newProducts.length} unique air filters.`);
    if (newProducts.length > 0) {
        fs.writeFileSync('air_filters_scraped.json', JSON.stringify(newProducts, null, 2));
        console.log("Saved to air_filters_scraped.json");
    }
}

scrapePages();
