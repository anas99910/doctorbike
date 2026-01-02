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
});
