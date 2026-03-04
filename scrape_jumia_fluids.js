const fs = require('fs');

async function scrapeJumiaFluids() {
    const url = "https://www.jumia.ma/fluides-entretien-huile-moteur/?srsltid=AfmBOorj0BoVgNRKAW4s8VAYGZdi5K1O_qGJnOnITzdGYfWGQN6nNW1R";
    let newProducts = [];

    // Read the existing products first to handle deduplication
    let existingProductsJs = fs.readFileSync('js/products.js', 'utf8').toLowerCase();

    // Strict Blacklist of words to reject whole products
    const blacklist = [
        "manix", "durex", "préservatif", "preservatif", "silicone", "gel lubrifiant", "d'amour",
        "auto", "voiture", "diesel", "renault", "dacia", "peugeot", "clio", "megane", "logan",
        "sandero", "duster", "lodgy", "captur", "coche", "pince", "carrosserie"
    ];

    console.log(`Fetching ${url}...`);
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
            const lowerTitle = title.toLowerCase();

            // Check blacklist
            const isBlacklisted = blacklist.some(word => lowerTitle.includes(word));
            if (isBlacklisted) {
                console.log(`❌ Rejected (Blacklist): ${title}`);
                continue;
            }

            // Extract image
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

            if (title && imgUrl && !imgUrl.includes("data:image")) {
                // Check if duplicate in JS
                if (!existingProductsJs.includes(`"title": "${lowerTitle}"`) &&
                    !newProducts.find(p => p.title.toLowerCase() === lowerTitle)) {
                    newProducts.push({ title, image: imgUrl });
                    console.log(`✅ Accepted: ${title}`);
                } else {
                    console.log(`⚠️ Skipped (Duplicate): ${title}`);
                }
            }
        }
    } catch (e) {
        console.error("Error fetching", url, e);
    }

    if (newProducts.length > 0) {
        console.log(`\nFound ${newProducts.length} NEW VALID products. Appending to products.js...`);
        let existingProductsJsRaw = fs.readFileSync('js/products.js', 'utf8');
        const newProductsObj = JSON.stringify(newProducts, null, 2).slice(1, -1);
        const finalProductsJs = existingProductsJsRaw.replace('];', ',' + newProductsObj + '\n];');
        fs.writeFileSync('js/products.js', finalProductsJs);
        console.log("Successfully appended new products.");
    } else {
        console.log("\nNo new products found. All products seem to be duplicates, blacklisted, or already exist.");
    }
}

scrapeJumiaFluids();
