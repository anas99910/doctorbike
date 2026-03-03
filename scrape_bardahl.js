const fs = require('fs');

async function scrapeBardahl() {
    const urls = [
        "https://bardahl.ma/collections/moto",
        "https://bardahl.ma/collections/moto?page=2"
    ];
    let products = [];

    for (const url of urls) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            // Simple regex to extract products since we can't use DOMParser in vanilla Node without JSDOM
            // We look for card-wrapper links and images
            const cardRegex = /<li class="grid__item"[^>]*>([\s\S]*?)<\/li>/g;
            let match;

            while ((match = cardRegex.exec(html)) !== null) {
                const cardHtml = match[1];

                // Extract title
                const titleMatch = cardHtml.match(/<a[^>]*class="full-unstyled-link"[^>]*>([\s\S]*?)<\/a>/);
                const title = titleMatch ? titleMatch[1].trim() : null;

                // Extract image
                let imgUrl = null;
                const imgMatch = cardHtml.match(/<img[^>]*srcset="([^"]*)"/);
                if (imgMatch) {
                    const srcset = imgMatch[1];
                    const firstImg = srcset.split(',')[0].trim().split(' ')[0];
                    imgUrl = "https:" + firstImg.split('?')[0] + "?width=823";
                } else {
                    const srcMatch = cardHtml.match(/<img[^>]*src="([^"]*)"/);
                    if (srcMatch) {
                        imgUrl = "https:" + srcMatch[1].split('?')[0] + "?width=823";
                    }
                }

                if (title && imgUrl && !products.find(p => p.title === title)) {
                    products.push({ title, image: imgUrl });
                }
            }
        } catch (e) {
            console.error("Error fetching", url, e);
        }
    }

    fs.writeFileSync('bardahl_products.json', JSON.stringify(products, null, 2));
    console.log(`Scraped ${products.length} products.`);
}

scrapeBardahl();
