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
        section.classList.add('fade-in-section');
        observer.observe(section);
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
});

