const fs = require('fs');

async function scrapeJumia() {
    const url = "https://www.jumia.ma/mlp-huile-moto-4t/?srsltid=AfmBOoqTG8A9nXuDivRLbfTPsqrFuXrm2ph7WOSPMWZuA_f5y6OxYQFE";
    let products = [];
    const excludedTitle = "Pince de réparation de carrosserie automobile professionnelle à usage intensif 4tonnes".toLowerCase();

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });
        const html = await response.text();

        // Jumia products are usually in <article class="prd ...">
        const articleRegex = /<article[^>]*class="[^"]*prd[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
        let match;

        while ((match = articleRegex.exec(html)) !== null) {
            const articleHtml = match[1];

            // Extract title usually in <h3 class="name">
            const titleMatch = articleHtml.match(/<h3[^>]*class="name"[^>]*>([\s\S]*?)<\/h3>/);
            if (!titleMatch) continue;
            const title = titleMatch[1].trim();

            if (title.toLowerCase().includes(excludedTitle)) {
                console.log("Excluded:", title);
                continue;
            }

            // Extract image usually in <img data-src="..." or src="..."
            let imgUrl = null;
            const dataSrcMatch = articleHtml.match(/<img[^>]*data-src="([^"]*)"/);
            if (dataSrcMatch) {
                imgUrl = dataSrcMatch[1];
            } else {
                const srcMatch = articleHtml.match(/<img[^>]*src="([^"]*)"/);
                if (srcMatch && !srcMatch[1].includes("data:image")) {
                    imgUrl = srcMatch[1];
                }
            }

            if (title && imgUrl && !imgUrl.includes("data:image") && !products.find(p => p.title === title)) {
                products.push({ title, image: imgUrl });
            }
        }
    } catch (e) {
        console.error("Error fetching", url, e);
    }

    fs.writeFileSync('jumia_products.json', JSON.stringify(products, null, 2));
    console.log(`Scraped ${products.length} products from Jumia.`);
}

scrapeJumia();
