const fs = require('fs');

async function scrapeIpone() {
    const urls = [
        "https://www.ipone.com/en/eshop/category/care-line-chain",
        "https://www.ipone.com/en/motor-oil-ranges/4-stroke-motorcycles"
    ];
    let products = [];

    for (const url of urls) {
        console.log(`Fetching ${url}...`);
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
            });
            const html = await response.text();

            // Based on Shopify-like structure usually seen in these sites
            // Let's look for product blocks. Often they have a class like 'product-card' or similar.
            // In the provided text, title was in ### and images in <picture>

            // Regex to find titles and images
            // Titles are often in <h3> or <a> tags with specific classes
            // Images are in <img src="..." or data-srcset="..."

            // Let's try to find common patterns in the HTML
            const productRegex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)<img[^>]*src="([^"]*)"/g;
            let match;
            while ((match = productRegex.exec(html)) !== null) {
                let title = match[1].replace(/<[^>]*>/g, '').trim();
                let imgUrl = match[3];

                if (title && imgUrl && !imgUrl.includes("data:image") && !products.find(p => p.title === title)) {
                    products.push({ title, image: imgUrl });
                }
            }

            // Fallback: search for all images and titles in common formats
            if (products.length === 0) {
                const images = html.match(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"/g);
                if (images) {
                    images.forEach(imgTag => {
                        const src = imgTag.match(/src="([^"]*)"/)[1];
                        const alt = imgTag.match(/alt="([^"]*)"/)[1];
                        if (src && alt && !src.includes("icon") && !src.includes("logo") && !src.includes("data:image")) {
                            products.push({ title: alt, image: src });
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Error fetching", url, e);
        }
    }

    fs.writeFileSync('ipone_products.json', JSON.stringify(products, null, 2));
    console.log(`Scraped ${products.length} products from Ipone.`);
}

scrapeIpone();
