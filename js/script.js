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

