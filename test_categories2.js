const fs = require('fs');

const productsContent = fs.readFileSync('js/products.js', 'utf8');
let bardahlProducts = [];
try {
    const match = productsContent.match(/const bardahlProducts\s*=\s*(\[[\s\S]*?\]);/);
    if (match) {
        bardahlProducts = eval(match[1]);
    }
} catch (e) {
    console.error("Could not parse products.js", e);
    process.exit(1);
}

function getProductCategory(title) {
    const t = title.toUpperCase();

    // 1. Chains
    if (t.includes('CHAIN') || t.includes('CHAINE')) {
        return 'chain';
    }

    // 2. Air Filters
    if (t.includes('FILTRE A AIR') || t.includes('HFA') || t.includes('HFF') || t.includes('CFA') || t.includes('JIABIN')) {
        if (t.includes('HUILE') && !t.includes('FILTRE A HUILE')) return 'maintenance';
        return 'air_filter';
    }

    // 3. Oil Filters
    if (t.includes('FILTRE A HUILE') || t.includes('HF') || t.includes('KN') || t.includes('HIFLOFILTRO')) {
        return 'filtre';
    }

    // 4. Tires
    if (t.includes('PNEU') || t.includes('DUNLOP') || t.includes('MICHELIN') || t.includes('WANDA') || t.includes('MITAS') || t.includes('TIMSUN') || t.includes('BRIDGESTONE') || t.includes('BUGGY') || t.includes('P3051')) {
        return 'pneu';
    }

    // 5. Engine Oils & Fluids
    if (t.includes('10W') || t.includes('5W') || t.includes('15W') || t.includes('20W') || t.includes('0W') ||
        t.includes('GEAR BOX') || t.includes('FOURCHE') || t.includes('KXT') || t.includes('XTM') ||
        t.includes('XTC') || t.includes('XT4S') || t.includes('SHOGUN') || t.includes('KATANA') ||
        t.includes('R4000') || t.includes('HUILE') || t.includes('2T') || t.includes('4T') ||
        t.includes('10.3') || t.includes('10.4') || t.includes('15.5') || t.includes('20.5')) {
        return 'oil';
    }

    return 'maintenance';
}

const stats = {
    oil: 0,
    air_filter: 0,
    filtre: 0,
    pneu: 0,
    chain: 0,
    maintenance: 0
};

const errors = [];

bardahlProducts.forEach(p => {
    const cat = getProductCategory(p.title);
    stats[cat]++;

    // Checks for specific mistakes
    if (cat === 'air_filter' && (p.title.includes('10W') || p.title.includes('Castrol') || p.title.includes('Motul'))) {
        errors.push(`Error: ${p.title} categorized as air_filter!`);
    }
    if (cat === 'filtre' && p.title.includes('AIR')) {
        errors.push(`Warning: ${p.title} categorized as filtre instead of air_filter!`);
    }
    if (cat === 'oil' && p.title.toLowerCase().includes('filtre à huile')) {
        errors.push(`Error: ${p.title} categorized as oil!`);
    }
});

console.log("Category Breakdown:");
console.table(stats);

if (errors.length > 0) {
    console.log("\nPotential Sorting Errors Found:");
    errors.forEach(e => console.log(e));
} else {
    console.log("\nAll sanity checks passed! No obivous sorting errors found.");
}

// Log a few items from each to visually inspect
console.log("\n-- Sample Oil Filters --");
bardahlProducts.filter(p => getProductCategory(p.title) === 'filtre').slice(0, 3).forEach(p => console.log(p.title));
console.log("\n-- Sample Engine Oils --");
bardahlProducts.filter(p => getProductCategory(p.title) === 'oil').slice(0, 3).forEach(p => console.log(p.title));
