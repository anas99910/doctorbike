document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Initialize the Shop Slider Teaser
    if (typeof initShopSlider === 'function') {
        initShopSlider();
    }

    // Smart WhatsApp Booking
    window.bookService = function (serviceType) {
        const phoneNumber = "212696344361";
        let message = "";

        switch (serviceType) {
            case 'maintenance':
                message = "Bonjour Doctor Biker, je voudrais prendre rendez-vous pour l'entretien de ma moto.";
                break;
            case 'diagnostic':
                message = "Bonjour, j'ai besoin d'un diagnostic pour ma moto (problème mécanique/électronique).";
                break;
            case 'custom':
                message = "Bonjour, je suis intéressé par un projet de personnalisation pour ma moto.";
                break;
            case 'performance':
                message = "Bonjour, je voudrais améliorer les suspensions/freins de ma moto.";
                break;
            default:
                message = "Bonjour Doctor Biker, je voudrais plus d'informations sur vos services.";
        }

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Scroll Animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Fade in sections
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'boutique-page') {
            section.classList.add('fade-in-section');
            observer.observe(section);
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // PWA Install Logic
    let deferredPrompt;
    const installBtnContainer = document.getElementById('install-btn-container');
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        if (installBtnContainer) {
            installBtnContainer.style.display = 'block';
        }

        console.log('beforeinstallprompt fired');
    });

    if (installBtn) {
        installBtn.addEventListener('click', (e) => {
            // Hide the app provided install promotion
            if (installBtnContainer) {
                installBtnContainer.style.display = 'none';
            }
            // Show the install prompt
            if (deferredPrompt) {
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            }
        });
    }

});

// --- Diagnostic Wizard Logic ---
let wizardState = {
    sound: '',
    feel: ''
};

window.wizardStep = function (stepNumber) {
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step-${stepNumber}`).classList.add('active');
}

window.wizardSelect = function (category, value) {
    wizardState[category] = value;

    if (category === 'sound') {
        // Move to step 2 after selecting sound
        wizardStep(2);
    } else if (category === 'feel') {
        // Calculate result after selecting feel
        calculateDiagnosis();
        wizardStep(3);
    }
}

window.calculateDiagnosis = function () {
    let diagnosis = "";
    const s = wizardState.sound;
    const f = wizardState.feel;

    // Simple Rule Engine
    if (s === 'silence') {
        diagnosis = "Cela ressemble fortement à un problème de <strong>Batterie ou de Démarreur</strong> (Battery/Starter Issue).";
    } else if (s === 'clicking' && f === 'brakes') {
        diagnosis = "Il pourrait s'agir de <strong>Plaquettes de Frein usées</strong> ou d'un disque voilé.";
    } else if (s === 'grinding' && f === 'power_loss') {
        diagnosis = "Attention : Possible problème de <strong>Transmission ou d'Embrayage</strong>.";
    } else if (f === 'vibration') {
        diagnosis = "Les vibrations indiquent souvent un <strong>Équilibrage des roues</strong> ou un problème de suspension.";
    } else if (f === 'wobbly') {
        diagnosis = "L'instabilité suggère une <strong>Pression des pneus</strong> incorrecte ou des roulements de direction usés.";
    } else if (f === 'power_loss') {
        diagnosis = "Une perte de puissance peut venir du <strong>Filtre à air, des Bougies ou de l'Injecteur</strong>.";
    } else {
        diagnosis = "Nous devons examiner votre moto de plus près pour un diagnostic précis.";
    }

    document.getElementById('wizard-result-text').innerHTML = diagnosis;
}

window.bookDiagnostic = function () {
    const message = `Bonjour Doctor Biker, j'ai utilisé l'assistant diagnostic.
Mes symptômes :
- Son : ${wizardState.sound}
- Ressenti : ${wizardState.feel}
Diagnostic suggéré : ${document.getElementById('wizard-result-text').innerText}
Je voudrais réserver un contrôle.`;

    const phoneNumber = "212696344361";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

window.resetWizard = function () {
    wizardState = { sound: '', feel: '' };
    wizardStep(1);
}

// --- Rotating Reviews Logic ---
const reviewsData = [
    {
        name: "Chad McCordic",
        text: "These guys are some of the best mechanics ive met in morocco. They helped me through some complex problems as I was making my international trip and they were the nicest guys. I came in stressed and overheated and I left confidant and cool. (They fixed my bmw f650gs twin)",
        rating: 5
    },
    {
        name: "Paul Wood",
        text: "A great place. They fixed by bike so am very happy..",
        rating: 5
    },
    {
        name: "Nabil Teodoro",
        text: "Best mechanics ever ❤️ Always got your back to fix and repair your issues.",
        rating: 5
    },
    {
        name: "Anis Limami",
        text: "Highly recommend, best place to mantain or fix your bike",
        rating: 5
    },
    {
        name: "Radouane Al Ghazouani",
        text: "The best doctor bro ✌️",
        rating: 5
    },
    {
        name: "Mansour Boucitta",
        text: "service excellent",
        rating: 5
    },
    {
        name: "Abderrahmane Bejjar",
        text: "Good services",
        rating: 5
    },
    {
        name: "Nabil Maxab",
        text: "Top Experience",
        rating: 5
    }
];

let currentReviewIndex = 0;
const reviewsContainer = document.getElementById('reviews-container');

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card fade-in'; // Start with fade-in

    // Star generation
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < review.rating) {
            starsHtml += '<i class="fas fa-star" style="color: #FFD700; font-size: 0.8rem;"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }

    card.innerHTML = `
        <div style="margin-bottom: 10px;">${starsHtml}</div>
        <p class="review-text">"${review.text}"</p>
        <div class="reviewer">
            <span class="name">${review.name}</span>
            <span style="color: #666; font-size: 0.8rem; margin-left: 10px;">• Google Review</span>
        </div>
    `;
    return card;
}

function renderReviews() {
    if (!reviewsContainer) return;

    // Fade out current content
    const currentCards = reviewsContainer.querySelectorAll('.review-card');
    currentCards.forEach(card => card.classList.add('fade-out'));

    // Wait for fade out to finish before changing content
    setTimeout(() => {
        reviewsContainer.innerHTML = '';

        // Get next 3 reviews
        for (let i = 0; i < 3; i++) {
            const index = (currentReviewIndex + i) % reviewsData.length;
            const review = reviewsData[index];
            reviewsContainer.appendChild(createReviewCard(review));
        }

        // Trigger reflow for fade-in
        // void reviewsContainer.offsetWidth; 

        // Cards are created with 'fade-in' class, so they should animate in
    }, 500);
}

function startReviewRotation() {
    // Initial render
    renderReviews();

    // Rotate every 60 seconds (60000ms)
    setInterval(() => {
        currentReviewIndex = (currentReviewIndex + 3) % reviewsData.length;
        renderReviews();
    }, 60000);
}

// --- Random Social Stats for Gallery ---
function randomizeGalleryStats() {
    const likeElements = document.querySelectorAll('.random-likes');
    const commentElements = document.querySelectorAll('.random-comments');

    likeElements.forEach(el => {
        // Random likes between 500 and 5000
        const likes = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
        // Format with 'k' if over 1000 (e.g., 1.2k)
        el.innerText = likes > 999 ? (likes / 1000).toFixed(1) + 'k' : likes;
    });

    commentElements.forEach(el => {
        // Random comments between 10 and 100
        const comments = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        el.innerText = comments;
    });
}

// Start when DOM is ready
// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    randomizeGalleryStats();
    startReviewRotation();

    // Render Boutique Products
    const productGrid = document.getElementById('boutique-product-grid');
    if (productGrid && typeof bardahlProducts !== 'undefined') {
        renderBoutiqueProducts(productGrid, bardahlProducts);
    }

    // (Boutique modal logic removed - now a dedicated page)

    // (Duplicate checkHashForProduct removed)

    // Close logic for modals
    document.querySelectorAll('.close-modal, .close-detail-modal').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.modal').style.display = "none";

            // Revert URL if closing a deep-linked modal but keep the base hash if necessary
            if (window.location.hash.startsWith('#product-')) {
                // Push state without hash
                history.pushState('', document.title, window.location.pathname + window.location.search);
            }

            // Check if any modal is still open before re-enabling overflow
            const openModals = Array.from(document.querySelectorAll('.modal')).some(m => m.style.display === 'block' || m.style.display === 'flex');
            if (!openModals) {
                document.body.style.overflow = "auto";
            }
        });
    });

    window.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = "none";

            if (window.location.hash.startsWith('#product-')) {
                history.pushState('', document.title, window.location.pathname + window.location.search);
            }

            const openModals = Array.from(document.querySelectorAll('.modal')).some(m => m.style.display === 'block' || m.style.display === 'flex');
            if (!openModals) {
                document.body.style.overflow = "auto";
            }
        }
    });

    // (Duplicate hashchange removed)

    // Boutique Search & Category Logic
    const boutiqueSearchInput = document.getElementById('boutiqueSearch');
    const categorySelect = document.getElementById('boutique-category-filter');
    const brandSelect = document.getElementById('boutique-brand-filter');
    const paginationLimitSelect = document.getElementById('pagination-limit-select');
    const paginationBar = document.getElementById('boutique-pagination-bar');
    const paginationInfo = document.getElementById('pagination-info');
    const paginationControls = document.getElementById('pagination-controls');

    let currentCategory = 'all';
    let currentBrand = 'all';
    let currentLimit = '24'; // default integer or 'all'
    let currentSearchTerm = '';
    let currentPage = 1;

    function buildPaginationControls(totalCards, limit, activePage) {
        if (!paginationBar || !paginationControls || !paginationInfo) return;

        if (totalCards <= 0) {
            paginationBar.style.display = 'none';
            return;
        }

        paginationBar.style.display = 'flex';

        // Helper to get translation without re-scanning whole document
        const getT = (key, defaultText) => {
            const currentLang = localStorage.getItem('preferredLanguage') || 'fr';
            return (translations[currentLang] && translations[currentLang][key]) || defaultText;
        };

        if (limit === Infinity || totalCards <= limit) {
            paginationInfo.innerHTML = `${getT('showing', 'Showing')} 1 - ${totalCards} ${getT('of', 'of')} ${totalCards}`;
            paginationControls.innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(totalCards / limit);
        const startItem = ((activePage - 1) * limit) + 1;
        const endItem = Math.min(activePage * limit, totalCards);

        paginationInfo.innerHTML = `<span>${getT('showing', 'Showing')}</span> ${startItem} - ${endItem} <span>${getT('of', 'of')}</span> ${totalCards}`;

        let btnsHTML = '';

        // Prev btn
        if (activePage > 1) {
            btnsHTML += `<button class="page-btn prev-next" data-page="${activePage - 1}"><i class="fas fa-chevron-left"></i></button>`;
        }

        let startPage, endPage;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (activePage <= 3) {
                startPage = 1; endPage = 5;
            } else if (activePage + 2 >= totalPages) {
                startPage = totalPages - 4; endPage = totalPages;
            } else {
                startPage = activePage - 2; endPage = activePage + 2;
            }
        }

        if (startPage > 1) {
            btnsHTML += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) btnsHTML += `<span style="color:var(--text-gray); margin:0 5px;">...</span>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === activePage ? 'active' : '';
            btnsHTML += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) btnsHTML += `<span style="color:var(--text-gray); margin:0 5px;">...</span>`;
            btnsHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next btn
        if (activePage < totalPages) {
            btnsHTML += `<button class="page-btn prev-next" data-page="${activePage + 1}"><i class="fas fa-chevron-right"></i></button>`;
        }

        paginationControls.innerHTML = btnsHTML;

        // Attach event listeners explicitly to current control set
        paginationControls.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = parseInt(btn.getAttribute('data-page'), 10);
                if (isNaN(targetPage)) return;

                // Update the PERSISTENT state
                currentPage = targetPage;
                filterBoutique();

                // Scroll up smoothly
                const gridOffset = document.getElementById('boutique-product-grid').getBoundingClientRect().top + window.scrollY - 180;
                window.scrollTo({ top: gridOffset, behavior: 'smooth' });
            });
        });
    }

    function filterBoutique() {
        const productCards = document.querySelectorAll('#boutique-product-grid .service-card');
        const limitStr = currentLimit;
        const limit = limitStr === 'all' ? Infinity : parseInt(limitStr, 10);

        let matchingCards = [];

        // 1. First pass: find all cards that match the core filters
        productCards.forEach(card => {
            const titleElement = card.querySelector('h4');
            if (!titleElement) return;

            const title = titleElement.textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            const brand = card.getAttribute('data-brand');

            const matchesSearch = currentSearchTerm === '' || title.includes(currentSearchTerm);
            const matchesCategory = currentCategory === 'all' || category === currentCategory;
            const matchesBrand = currentBrand === 'all' || brand === currentBrand;

            if (matchesSearch && matchesCategory && matchesBrand) {
                matchingCards.push(card);
            } else {
                card.style.display = "none";
            }
        });

        // Ensure currentPage doesn't overshoot if we filtered down heavily
        const totalMatching = matchingCards.length;
        if (limit !== Infinity) {
            const maxPage = Math.ceil(totalMatching / limit);
            if (maxPage > 0 && currentPage > maxPage) {
                currentPage = maxPage;
            } else if (maxPage === 0) {
                currentPage = 1;
            }
        } else {
            currentPage = 1;
        }

        // 2. Second pass: limit by visible slice (Pagination)
        // CRITICAL FIX: (0 * Infinity) is NaN in JS. 
        const startIndex = limit === Infinity ? 0 : (currentPage - 1) * limit;
        const endIndex = limit === Infinity ? totalMatching : startIndex + limit;

        matchingCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });

        // 3. Build UI controls
        buildPaginationControls(totalMatching, limit, currentPage);
    }

    if (boutiqueSearchInput) {
        boutiqueSearchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase();
            currentPage = 1; // Reset to page 1 on new search
            filterBoutique();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            currentPage = 1;
            filterBoutique();
        });
    }

    if (brandSelect) {
        brandSelect.addEventListener('change', (e) => {
            currentBrand = e.target.value;
            currentPage = 1;
            filterBoutique();
        });
    }

    if (paginationLimitSelect) {
        paginationLimitSelect.addEventListener('change', (e) => {
            currentLimit = e.target.value;
            currentPage = 1; // Reset to page 1 when changing limit
            filterBoutique();
        });
    }

    // Initial run to ensure items per page (24) is applied right away
    setTimeout(() => {
        filterBoutique();
    }, 100);

});

// Helper to determine product category by keywords
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

// Helper to determine product brand by keywords
function getProductBrand(title, image) {
    const t = title.toUpperCase();
    const i = (image || '').toLowerCase();

    if (t.includes('BARDAHL') || i.includes('bardahl.ma') || t.includes('XTC') || t.includes('XTM') || t.includes('XTF')) {
        return 'bardahl';
    }
    if (t.includes('IPONE') || t.includes('KATANA') || t.includes('SHOGUN') || t.includes('SAMOURAÏ') || t.includes('SAMOURAI') || t.includes('R4000') || t.includes('R2000') || t.includes('10.3') || t.includes('10.4') || t.includes('15.5') || t.includes('20.5') || i.includes('ipone')) {
        return 'ipone';
    }
    if (i.includes('shopify.com') || i.includes('accentuate.io') || i.includes('prismic.io/ipone')) {
        return 'ipone';
    }
    if (t.includes('MOTUL') || t.includes('7100') || t.includes('5100') || t.includes('5000') || t.includes('3000') || t.includes('8100') || t.includes('SCOOTER EXPERT') || t.includes('X-CLEAN') || t.includes('X-CESS') || t.includes('ECO-CLEAN')) {
        return 'motul';
    }
    if (t.includes('LIQUI MOLY') || t.includes('MOTORBIKE 4T') || t.includes('ENGINE FLUSH') || t.includes('SHOOTER') || i.includes('liqui-moly')) {
        return 'liquimoly';
    }
    if (t.includes('CASTROL')) {
        return 'castrol';
    }
    if (t.includes('MICHELIN')) return 'michelin';
    if (t.includes('DUNLOP')) return 'dunlop';
    if (t.includes('BRIDGESTONE')) return 'bridgestone';
    if (t.includes('WANDA') || t.includes('BUGGY') || t.includes('P3051')) return 'wanda';
    if (t.includes('MITAS')) return 'mitas';
    if (t.includes('TIMSUN')) return 'timsun';

    if (t.includes('HIFLOFILTRO') || t.includes('HIFLOFITRO')) return 'hiflofiltro';
    if (t.includes('K&N') || t.includes('KN')) return 'kn';
    if (t.includes('MIW') || t.includes('MEIWA')) return 'miw';
    if (t.includes('EVEREST')) return 'other';
    if (t.includes('JIABIN')) return 'other';
    if (t.includes('HARLEY DAVIDSON')) return 'other';

    return 'other';
}

// Render Dynamic Boutique Grid
function renderBoutiqueProducts(gridElement, products) {
    gridElement.innerHTML = ''; // Clear loading/existing items

    products.forEach(product => {
        // Construct a safe URL slug for deep linking
        const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Construct the WhatsApp message URL
        const message = encodeURIComponent(`Bonjour, je suis intéressé(e) par votre produit ${product.title}`);
        const whatsappUrl = `https://wa.me/212696344361?text=${message}`;

        const category = getProductCategory(product.title);
        const brand = getProductBrand(product.title, product.image);
        const cardHTML = `
            <div class="service-card" data-category="${category}" data-brand="${brand}" data-slug="${slug}" style="display: flex; flex-direction: column; cursor: pointer;">
                <img src="${product.image}"
                     alt="${product.title}"
                     style="width: 100%; height: 250px; object-fit: contain; border-radius: 8px; margin-bottom: 25px;"
                     loading="lazy">
                <h4 class="product-card-title" style="margin-bottom: 25px; min-height: 48px; text-transform: uppercase; pointer-events: none;">${product.title}</h4>
                <a href="${whatsappUrl}"
                   target="_blank" class="btn-clay"
                   style="margin-top: auto; pointer-events: none;">
                    <div class="clay-icon-wrapper">
                        <i class="fab fa-whatsapp"></i>
                    </div>
                    <span class="clay-text" data-i18n="btn_order">Commander</span>
                </a>
            </div>
        `;
        gridElement.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Add click event listeners to the new cards to open the detail modal
    document.querySelectorAll('#boutique-product-grid .service-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            openProductDetail(products[index]);
        });
    });

    // Re-run translations on the newly injected elements
    if (typeof changeLanguage === 'function') {
        const lang = localStorage.getItem('preferredLanguage') || 'fr';
        changeLanguage(lang);
    }

    // Check if we arrived via a deep link right after rendering is done
    if (typeof window.checkHashForProduct === 'function') {
        window.checkHashForProduct();
    }
}

// Function to open the Product Detail Modal
function openProductDetail(product) {
    const modal = document.getElementById('productDetailModal');
    const titleEl = document.getElementById('detailTitle');
    const imgEl = document.getElementById('detailImage');
    const orderBtn = document.getElementById('detailOrderBtn');
    const descEl = document.getElementById('detailDesc');

    // Set content
    titleEl.textContent = product.title;
    imgEl.src = product.image;
    imgEl.alt = product.title;

    // Translation Map for Product Descriptions
    const descTranslations = {
        "Mousse nettoyante multi-surfaces efficace pour l'entretien complet de votre moto. Laisse une finition impeccable.": "Effective multi-surface cleaning foam for complete maintenance of your motorcycle. Leaves a flawless finish.",
        "Huile de transmission de très haute qualité. Assure des passages de vitesse fluides et protège la boîte de vitesses.": "High-quality transmission oil. Ensures smooth gear shifts and protects the gearbox.",
        "Fluide hydraulique avancé pour fourches de motos. Garantit un amortissement constant et une excellente maniabilité.": "Advanced hydraulic fluid for motorcycle forks. Guarantees constant damping and excellent handling.",
        "Produit d'entretien de première qualité, sélectionné spécialement pour votre moto.": "Premium quality maintenance product, specially selected for your motorcycle.",
        "Huile synthétique premium pour moteurs 2-temps. Excellente lubrification, réduit l'usure et la formation de dépôts.": "Premium synthetic oil for 2-stroke engines. Excellent lubrication, reduces wear and deposit formation.",
        "Liquide de frein haute performance pour motos. Résiste aux hautes températures pour un freinage puissant et sécurisé.": "High performance brake fluid for motorcycles. Resists high temperatures for powerful and safe braking.",
        "Lubrifiant haute performance pour chaîne de moto. Offre une protection maximale contre l'usure et la corrosion, même dans des conditions extrêmes.": "High performance lubricant for motorcycle chain. Offers maximum protection against wear and corrosion, even in extreme conditions.",
        "Huile moteur premium 4-temps. Formule avancée qui prolonge la durée de vie du moteur, réduit les frictions et améliore les performances.": "Premium 4-stroke engine oil. Advanced formula that extends engine life, reduces friction and improves performance.",
        "Lubrifiant spécialement formulé pour les quads et scooters. Offre une protection et des performances optimales en ville ou en tout-terrain.": "Lubricant specifically formulated for quads and scooters. Offers optimal protection and performance in city or off-road.",
        "Dégraissant surpuissant pour chaînes de motos. Élimine rapidement les résidus et la saleté incrustée.": "Super powerful degreaser for motorcycle chains. Quickly removes residues and encrusted dirt.",
        "Brosse de chaîne ergonomique avec poils robustes pour un nettoyage efficace en profondeur.": "Ergonomic chain brush with sturdy bristles for deep effective cleaning.",
        "Pneu moto haute performance. Assure une excellente adhérence et une durabilité optimale.": "High performance motorcycle tire. Ensures excellent grip and optimal durability.",
        "Filtre à huile haute performance pour moto. Assure une filtration optimale du moteur.": "High performance motorcycle oil filter. Ensures optimal engine filtration.",
        "Huile moteur synthétique très haute performance pour motos 4T. Protection exceptionnelle contre l'usure et réduction des frictions.": "Very high performance synthetic engine oil for 4T motorcycles. Exceptional protection against wear and reduced friction.",
        "Huile moteur semi-synthétique de haute qualité pour motos 4T. Idéale pour un usage quotidien et les longs trajets.": "High-quality semi-synthetic engine oil for 4T motorcycles. Ideal for daily use and long trips.",
        "Lubrifiant synthétique Premium pour un entretien optimal de la chaîne de votre moto. Résiste à l'eau et limite les projections.": "Premium synthetic lubricant for optimal maintenance of your motorcycle chain. Water-resistant and prevents fling-off.",
        "Lubrifiant spécial pour filtres à air en mousse. Empêche la pénétration de la saleté, de la poussière et de l'eau.": "Special lubricant for foam air filters. Prevents dirt, dust, and water penetration.",
        "Liquide de refroidissement organique prêt à l'emploi. Prévient la surchauffe et protège le système de refroidissement contre la corrosion.": "Ready-to-use organic coolant. Prevents overheating and protects the cooling system against corrosion.",
        "Maintient le moteur parfaitement propre. Excellente protection anti-usure. Idéal pour une utilisation urbaine.": "Keeps the engine perfectly clean. Excellent wear protection. Ideal for urban use.",
        "Nettoie l'ensemble de l'installation d'injection du moteur. Améliore les performances.": "Cleans the entire engine injection system. Improves performance.",
        "Huile synthétique premium pour moteurs 2-temps de motos sportives et tout-terrain. Réduit l'émission de fumées.": "Premium synthetic oil for 2-stroke engines of sporty and off-road motorcycles. Reduces smoke emission."
    };

    // Set Description if available
    if (descEl) {
        let text = product.description || "Produit d'entretien de première qualité, sélectionné spécialement pour votre moto.";
        const lang = localStorage.getItem('preferredLanguage') || 'fr';

        if (lang === 'en' && descTranslations[text]) {
            text = descTranslations[text];
        }

        descEl.textContent = text;
    }

    // Create WhatsApp link directly inside the detail view
    const lang = localStorage.getItem('preferredLanguage') || 'fr';
    const message = encodeURIComponent(
        lang === 'en'
            ? `Hello, I am interested in your product ${product.title}`
            : `Bonjour, je suis intéressé(e) par votre produit ${product.title}`
    );
    orderBtn.href = `https://wa.me/212696344361?text=${message}`;

    // Update URL for deep linking
    const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    history.pushState({ modal: true }, '', `#product-${slug}`);

    // Show modal and disable background scroll
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Check URL Hash to open specific product modal on load or navigation
window.checkHashForProduct = function () {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#product-')) {
        const slug = hash.replace('#product-', '');

        // Ensure products exist before trying to find one
        if (typeof bardahlProducts !== 'undefined') {
            const product = bardahlProducts.find(p => {
                const pSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return pSlug === slug;
            });

            if (product) {
                openProductDetail(product);
            }
        }
    }
};

// Listen for browser navigation (Back/Forward buttons)
window.addEventListener('hashchange', () => {
    // If the hash is empty, they navigated back to the main page
    if (!window.location.hash || !window.location.hash.startsWith('#product-')) {
        const modal = document.getElementById('productDetailModal');
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    } else {
        // Otherwise, try to open the product
        window.checkHashForProduct();
    }
});

// Function to initialize the Shop Slider Teaser
window.initShopSlider = function () {
    const track = document.getElementById('shop-slider-track');
    if (!track) return;

    // Ensure products exist
    if (typeof bardahlProducts === 'undefined') return;

    // Pick ~10 products
    const selectedProducts = [
        ...bardahlProducts.slice(0, 10)
    ];

    let htmlContent = '';
    selectedProducts.forEach(product => {
        const title = product.title || '';
        const img = product.image || '';

        htmlContent += `
            <div class="shop-slide-card" onclick="window.location.href='boutique.html#product-${product.slug || ''}'">
                <img src="${img}" alt="${title}" class="shop-slide-img" loading="lazy">
                <h4 class="shop-slide-title">${title}</h4>
            </div>
        `;
    });

    // To make infinite scroll seamless, duplicate the content once
    track.innerHTML = htmlContent + htmlContent;
};
