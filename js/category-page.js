// category-page.js
// Shared script for all 6 individual SEO category pages.
// Each page sets window.PAGE_CATEGORY before this script runs.

document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.getElementById('boutique-product-grid');
    const paginationBar = document.getElementById('boutique-pagination-bar');
    const paginationInfo = document.getElementById('pagination-info');
    const paginationControls = document.getElementById('pagination-controls');
    const paginationLimitSelect = document.getElementById('pagination-limit-select');
    const boutiqueSearchInput = document.getElementById('boutiqueSearch');
    const brandSelect = document.getElementById('boutique-brand-filter');

    if (!productGrid) return;

    // --- Merge all product arrays ---
    const allProducts = [
        ...(typeof bardahlProducts !== 'undefined' ? bardahlProducts : []),
        ...(typeof iponeProducts !== 'undefined' ? iponeProducts : []),
    ];

    // Initialize Smart Search Autocomplete (global function from script.js)
    if (typeof initSmartSearch === 'function') {
        initSmartSearch();
    }

    // --- Pre-filter to this page's category ---
    const pageCategory = window.PAGE_CATEGORY || 'all';
    const pageProducts = pageCategory === 'all'
        ? allProducts
        : allProducts.filter(p => getProductCategory(p.title) === pageCategory);

    // --- State ---
    let currentBrand = 'all';
    let currentSearchTerm = '';
    let currentPage = 1;
    let currentLimit = 24;

    // --- Render all category products into the grid ---
    renderBoutiqueProducts(productGrid, pageProducts);

    // --- Inject JSON-LD Product Schema for SEO ---
    function injectProductSchema() {
        const pageUrl = window.location.href;
        const pageTitle = document.querySelector('h1')?.textContent?.trim() || document.title;
        const pageDesc = document.querySelector('meta[name="description"]')?.content || '';

        const schemaProducts = pageProducts.slice(0, 50).map((p, i) => ({
            '@type': 'ListItem',
            'position': i + 1,
            'item': {
                '@type': 'Product',
                'name': p.title,
                'image': p.image || '',
                'description': p.description || '',
                'sku': p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                'brand': {
                    '@type': 'Brand',
                    'name': p.brand ? p.brand.charAt(0).toUpperCase() + p.brand.slice(1) : 'Doctor Biker'
                },
                'aggregateRating': {
                    '@type': 'AggregateRating',
                    'ratingValue': '5',
                    'reviewCount': '1'
                },
                'offers': {
                    '@type': 'Offer',
                    'availability': 'https://schema.org/InStock',
                    'price': '0',
                    'priceCurrency': 'MAD',
                    'seller': {
                        '@type': 'LocalBusiness',
                        'name': 'Doctor Biker Garage',
                        'address': {
                            '@type': 'PostalAddress',
                            'addressLocality': 'Casablanca',
                            'addressCountry': 'MA'
                        }
                    }
                }
            }
        }));

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': pageTitle,
            'description': pageDesc,
            'url': pageUrl,
            'numberOfItems': pageProducts.length,
            'itemListElement': schemaProducts
        };

        const existing = document.getElementById('product-schema-ld');
        if (existing) existing.remove();

        const scriptTag = document.createElement('script');
        scriptTag.id = 'product-schema-ld';
        scriptTag.type = 'application/ld+json';
        scriptTag.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(scriptTag);
    }

    injectProductSchema();

    // --- Filter & Paginate ---
    function filterAndPaginate() {
        const cards = Array.from(productGrid.querySelectorAll('.service-card'));
        const limit = currentLimit === 'all' ? Infinity : parseInt(currentLimit, 10);
        let matching = [];

        cards.forEach(card => {
            const title = (card.querySelector('h4')?.textContent || '').toLowerCase();
            const brand = card.getAttribute('data-brand');
            const matchSearch = currentSearchTerm === '' || title.includes(currentSearchTerm);
            const matchBrand = currentBrand === 'all' || brand === currentBrand;
            if (matchSearch && matchBrand) {
                matching.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        // Clamp page
        const totalPages = limit === Infinity ? 1 : Math.ceil(matching.length / limit);
        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

        const startIdx = limit === Infinity ? 0 : (currentPage - 1) * limit;
        const endIdx = limit === Infinity ? matching.length : startIdx + limit;

        matching.forEach((card, i) => {
            card.style.display = (i >= startIdx && i < endIdx) ? 'flex' : 'none';
        });

        buildPaginationUI(matching.length, limit, currentPage);
    }

    function buildPaginationUI(total, limit, activePage) {
        if (!paginationBar) return;
        if (total <= 0) { paginationBar.style.display = 'none'; return; }

        paginationBar.style.display = 'flex';

        const lang = localStorage.getItem('preferredLanguage') || 'fr';
        const t = (k, d) => (translations?.[lang]?.[k]) || d;

        if (limit === Infinity || total <= limit) {
            paginationInfo.innerHTML = `${t('showing', 'Showing')} 1 - ${total} ${t('of', 'of')} ${total}`;
            paginationControls.innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(total / limit);
        const start = (activePage - 1) * limit + 1;
        const end = Math.min(activePage * limit, total);
        paginationInfo.innerHTML = `${t('showing', 'Showing')} ${start} - ${end} ${t('of', 'of')} ${total}`;

        let btns = '';
        if (activePage > 1) btns += `<button class="page-btn prev-next" data-page="${activePage - 1}"><i class="fas fa-chevron-left"></i></button>`;

        let sp = Math.max(1, activePage - 2);
        let ep = Math.min(totalPages, activePage + 2);
        if (activePage <= 3) { sp = 1; ep = Math.min(5, totalPages); }
        else if (activePage >= totalPages - 2) { sp = Math.max(1, totalPages - 4); ep = totalPages; }

        if (sp > 1) { btns += `<button class="page-btn" data-page="1">1</button>`; if (sp > 2) btns += `<span style="color:var(--text-gray);margin:0 5px">...</span>`; }
        for (let i = sp; i <= ep; i++) btns += `<button class="page-btn ${i === activePage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        if (ep < totalPages) { if (ep < totalPages - 1) btns += `<span style="color:var(--text-gray);margin:0 5px">...</span>`; btns += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`; }
        if (activePage < totalPages) btns += `<button class="page-btn prev-next" data-page="${activePage + 1}"><i class="fas fa-chevron-right"></i></button>`;

        paginationControls.innerHTML = btns;
        paginationControls.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                currentPage = parseInt(btn.getAttribute('data-page'), 10);
                filterAndPaginate();
                const gridTop = productGrid.getBoundingClientRect().top + window.scrollY - 180;
                window.scrollTo({ top: gridTop, behavior: 'smooth' });
            });
        });
    }

    // --- Event Listeners ---
    if (boutiqueSearchInput) {
        boutiqueSearchInput.addEventListener('input', e => {
            currentSearchTerm = e.target.value.toLowerCase();
            currentPage = 1;
            filterAndPaginate();
        });
    }
    if (brandSelect) {
        brandSelect.addEventListener('change', e => {
            currentBrand = e.target.value;
            currentPage = 1;
            filterAndPaginate();
        });
    }
    if (paginationLimitSelect) {
        paginationLimitSelect.addEventListener('change', e => {
            currentLimit = e.target.value;
            currentPage = 1;
            filterAndPaginate();
        });
    }

    // --- Close modals ---
    document.querySelectorAll('.close-modal, .close-detail-modal').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- Mobile Nav (with overlay) ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
    function closeMobileMenu() {
        mobileMenuBtn?.classList.remove('active');
        navMenu?.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) { closeMobileMenu(); }
            else {
                mobileMenuBtn.classList.add('active');
                navMenu.classList.add('active');
                navOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    navOverlay.addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', closeMobileMenu));

    // --- Initial filter pass ---
    setTimeout(filterAndPaginate, 100);
});
