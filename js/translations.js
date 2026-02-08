const translations = {
    fr: {
        nav_home: "Accueil",
        nav_about: "À Propos",
        nav_services: "Services",
        nav_gallery: "Galerie",
        nav_reviews: "Avis",
        nav_contact: "Contact",
        media_title: "Vlogs & Expériences",
        media_subtitle: "Découvrez l'univers du garage en vidéo !",
        hero_subtitle: "Meilleur Garage Moto & Customisation à Casablanca",
        hero_contact: "Contactez-nous",
        hero_directions: "Itinéraire",
        about_title: "Qui Sommes-Nous",
        about_text_1: "Doctor Biker Garage est le spécialiste de la <strong>Réparation & Customisation Moto</strong> à Casablanca. Nous transformons votre passion en performance.",
        about_text_2: "Expertise multimarque : <strong>Honda, Yamaha, Kawasaki, BMW, KTM, Ducati, Suzuki, CFMOTO et SYM</strong>. Du diagnostic électronique à la préparation moteur, nous sommes votre partenaire de confiance.",
        stat_followers: "Abonnés",
        stat_rating: "Note",
        stat_passion: "Passion",
        services_title: "Nos Services Moto",
        service_maint_title: "Entretien & Vidange",
        service_maint_desc: "Révision complète, vidange, filtres, plaquettes de frein et graissage chaîne.",
        service_diag_title: "Diagnostic Électronique",
        service_diag_desc: "Recherche de panne avancée, effacement voyants et paramétrage.",
        service_custom_title: "Customisation & Prépa",
        service_custom_desc: "Café Racer, Scrambler, modifications esthétiques et performances.",
        service_brakes_title: "Suspension & Freinage",
        service_brakes_desc: "Amélioration tenue de route et freinage haute performance.",
        gallery_title: "Galerie",
        reviews_title: "Avis Clients",
        brands_title: "Marques & Partenaires",
        book_btn: "Réserver sur WhatsApp",
        contact_title: "Contactez l'Atelier",
        contact_subtitle: "Besoin d'un devis ou d'un rendez-vous ?",
        contact_hours: "Heures d'ouverture",
        contact_mon_sat: "Mardi - Dimanche: 11h40 - 19h00",
        contact_sun: "Lundi: Fermé",
        contact_address: "Adresse",
        contact_phone: "Téléphone",
        footer_rights: "&copy; 2026 Doctor Biker Garage. Tous droits réservés.",
        footer_slogan: "Réanimer les Moteurs, Restaurer les Âmes.",
        stat_years: "Années d'Expérience",
        feat_expert: "Experts Moto",
        feat_diag: "Diag Précis",
        feat_parts: "Pièces Origine",
        rate_us_super: "S'IL VOUS PLAÎT",
        rate_us_title: "NOTEZ-NOUS"
    },
    en: {
        nav_home: "Home",
        nav_about: "About",
        nav_services: "Services",
        nav_gallery: "Gallery",
        nav_reviews: "Reviews",
        nav_contact: "Contact",

        // Media Section
        media_title: "Vlogs & Experiences",
        media_subtitle: "Discover the garage universe on video!",

        hero_subtitle: "Best Motorcycle Garage & Custom Shop in Casablanca",
        hero_contact: "Contact Us",
        hero_directions: "Get Directions",
        about_title: "Who We Are",
        about_text_1: "Doctor Biker Garage is the leading <strong>Motorcycle Repair & Custom Shop</strong> in Casablanca. We turn your passion into performance.",
        about_text_2: "Multi-brand expertise: <strong>Honda, Yamaha, Kawasaki, BMW, KTM, Ducati, Suzuki, CFMOTO, and SYM</strong>. From electronic diagnostics to engine tuning, we are your trusted partner.",
        stat_followers: "Followers",
        stat_rating: "Rating",
        stat_passion: "Passion",
        services_title: "Our Moto Services",
        service_maint_title: "Maintenance & Oil",
        service_maint_desc: "Full service, oil change, filters, brake pads, and chain lube.",
        service_diag_title: "Electronic Diagnostic",
        service_diag_desc: "Advanced troubleshooting, error code clearing, and tuning.",
        service_custom_title: "Custom & Mods",
        service_custom_desc: "Cafe Racer, Scrambler, aesthetic and performance upgrades.",
        service_brakes_title: "Suspension & Brakes",
        service_brakes_desc: "Handling improvements and high-performance braking systems.",
        gallery_title: "Gallery",
        reviews_title: "Rider Reviews",
        brands_title: "Brands & Partners",
        book_btn: "Book on WhatsApp",
        contact_title: "Contact Workshop",
        contact_subtitle: "Need a quote or appointment?",
        contact_hours: "Opening Hours",
        contact_mon_sat: "Tue - Sun: 11:40 AM - 7:00 PM",
        contact_sun: "Monday: Closed",
        contact_address: "Address",
        contact_phone: "Phone",
        footer_rights: "&copy; 2026 Doctor Biker Garage. All rights reserved.",
        footer_slogan: "Reviving Engines, Restoring Souls.",
        stat_years: "Years Experience",
        feat_expert: "Moto Experts",
        feat_diag: "Precise Diag",
        feat_parts: "OEM Parts",
        rate_us_super: "PLEASE",
        rate_us_title: "RATE US"
    }
};

function changeLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // Update active state of buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(lang === 'fr' ? 'fr' : 'en')) {
            btn.classList.add('active');
        }
    });

    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
    changeLanguage(savedLang);
});
