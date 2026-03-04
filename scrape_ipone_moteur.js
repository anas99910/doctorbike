const fs = require('fs');

async function scrapeNewIpone() {
    const url = "https://www.ipone.com/fr/eshop/categorie/huiles-moteur";
    let newProducts = [];

    // Read the existing products first to handle deduplication
    let existingProductsJs = fs.readFileSync('js/products.js', 'utf8');

    // Extract JSON part roughly to build an array of existing titles
    // We can just rely on string matching to check if a title exists in the file
    // which is safer than complex JSON parsing if the file has trailing commas or custom formatting

    console.log(`Fetching ${url}...`);
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });
        const html = await response.text();

        // The product titles might be inside <h3> or <a> tags, and images in <img src="..." data-src="...">
        const productRegex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)<img[^>]*src="([^"]*)"/g;
        let match;
        while ((match = productRegex.exec(html)) !== null) {
            let title = match[1].replace(/<[^>]*>/g, '').trim();
            // French page might have trailing strings or different formats, but title is usually clean
            let imgUrl = match[3];

            if (title && imgUrl && !imgUrl.includes("data:image")) {
                // Check for duplicates before pushing
                if (!existingProductsJs.includes(`"title": "${title}"`) &&
                    !newProducts.find(p => p.title === title)) {
                    newProducts.push({ title, image: imgUrl });
                }
            }
        }

        // Fallback search
        if (newProducts.length === 0) {
            const images = html.match(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"/g);
            if (images) {
                images.forEach(imgTag => {
                    const src = imgTag.match(/src="([^"]*)"/)[1];
                    let alt = imgTag.match(/alt="([^"]*)"/)[1].trim();
                    // Avoid basic icons
                    if (src && alt && !src.includes("icon") && !src.includes("logo") && !src.includes("data:image")) {
                        // Check for duplicate
                        if (!existingProductsJs.includes(`"title": "${alt}"`) &&
                            // Some products might match existing ones but with slight case differences
                            !existingProductsJs.toLowerCase().includes(`"title": "${alt.toLowerCase()}"`) &&
                            !newProducts.find(p => p.title.toLowerCase() === alt.toLowerCase())) {
                            newProducts.push({ title: alt, image: src });
                        }
                    }
                });
            }
        }

    } catch (e) {
        console.error("Error fetching", url, e);
    }

    if (newProducts.length > 0) {
        console.log(`Found ${newProducts.length} NEW products. Appending to products.js...`);
        // Format the new products as JSON string, strip the outer brackets [ ]
        const newProductsObj = JSON.stringify(newProducts, null, 2).slice(1, -1);
        // Replace the final "];" with ", \n [new objects] \n];"
        const finalProductsJs = existingProductsJs.replace('];', ',' + newProductsObj + '\n];');
        fs.writeFileSync('js/products.js', finalProductsJs);
        console.log("Successfully appended new products.");
    } else {
        console.log("No new products found. All products seem to be duplicates or already exist.");
    }
}

scrapeNewIpone();
