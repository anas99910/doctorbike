const fs = require('fs');

const scrapedDataFile = 'air_filters_scraped.json';
const productsJsFile = 'js/products.js';

if (!fs.existsSync(scrapedDataFile)) {
    console.error("Scraped data not found!");
    process.exit(1);
}

const newProducts = JSON.parse(fs.readFileSync(scrapedDataFile, 'utf8'));
let currentProductsStr = fs.readFileSync(productsJsFile, 'utf8');

if (newProducts.length > 0) {
    console.log(`Adding ${newProducts.length} products to products.js...`);

    // Add custom description for air filters
    newProducts.forEach(p => {
        p.description = "Filtre à air de haute qualité pour moto. Améliore la respiration du moteur et augmente les performances.";
    });

    const newStr = JSON.stringify(newProducts, null, 2);
    // Remove the leading and trailing brackets to get just the object strings
    const innerObjects = newStr.slice(1, -1);

    // Find the end of bardahlProducts array. It ends with: ]
    // We basically want to replace the LAST array closing bracket for bardahlProducts
    // But products.js has other stuff at the end maybe. Let's look for "\n]" before the other comments/data starts or at the end of the bardahlProducts array declaration.

    // Simple way: find the last occurrence of '}' before '];' which marks the end of bardahlProducts
    const endBracketIndex = currentProductsStr.lastIndexOf(']');
    if (endBracketIndex !== -1) {
        const firstPart = currentProductsStr.substring(0, endBracketIndex);
        const secondPart = currentProductsStr.substring(endBracketIndex);

        // Ensure there's a comma before appending
        const modifiedProducts = firstPart.trimEnd() + ",\n  " + innerObjects.trim() + "\n" + secondPart;
        fs.writeFileSync(productsJsFile, modifiedProducts);
        console.log("Successfully injected air filters into products.js");
    } else {
        console.log("Couldn't find the end of the array inside products.js");
    }
}
