const translations = {
    fr: {
        nav_home: "Accueil",
        nav_about: "À Propos",
        nav_services: "Services",
        nav_gallery: "Galerie",
        nav_reviews: "Avis",
        nav_contact: "Contact",
        hero_subtitle: "Atelier d'Accessoires & Préparation Moto",
        hero_contact: "Contactez-nous",
        hero_directions: "Itinéraire",
        about_title: "Qui Sommes-Nous",
        about_text_1: "Doctor Biker Garage est un <strong>Atelier d'Accessoires & Préparation Moto</strong> de premier plan à Casablanca. Nous sommes spécialisés dans la personnalisation et la préparation de motos pour la performance et le style.",
        about_text_2: "Nous servons toutes les grandes marques, y compris <strong>Honda, Yamaha, Kawasaki, BMW, KTM, Ducati, Suzuki, CFMOTO et SYM</strong>. Que ce soit pour un diagnostic, une réparation ou une construction complète, notre passion motive chaque service.",
        stat_followers: "Abonnés",
        stat_rating: "Note",
        stat_passion: "Passion",
        services_title: "Nos Services",
        service_maint_title: "Entretien",
        service_maint_desc: "Changements d'huile, filtres, freins et mises au point générales.",
        service_diag_title: "Diagnostic",
        service_diag_desc: "Dépannage avancé des systèmes électroniques et mécaniques.",
        service_custom_title: "Construction Personnalisée",
        service_custom_desc: "Modifications sur mesure pour transformer votre moto en une machine unique.",
        service_brakes_title: "Suspension & Freins",
        service_brakes_desc: "Améliorations de performance pour la piste et la rue.",
        gallery_title: "Galerie",
        reviews_title: "Ce Que Disent les Motards",
        brands_title: "Marques & Partenaires",
        book_btn: "Réserver sur WhatsApp",
        contact_title: "Contactez-nous",
        contact_subtitle: "Nous serions ravis de vous entendre",
        contact_hours: "Heures d'ouverture",
        contact_mon_sat: "Mardi - Dimanche: 11h40 - 19h00",
        contact_sun: "Lundi: Fermé",
        contact_address: "Adresse",
        contact_phone: "Téléphone",
        footer_rights: "&copy; 2026 Doctor Biker Garage. Tous droits réservés.",
        footer_slogan: "Réanimer les Moteurs, Restaurer les Âmes.",
        footer_slogan: "Réanimer les Moteurs, Restaurer les Âmes.",
        stat_years: "Années d'Expérience",
        feat_expert: "Expertise Technique",
        feat_diag: "Diagnostic Avancé",
        feat_parts: "Pièces Premium",
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
        hero_subtitle: "Motorcycle Accessories & Preparation Workshop",
        hero_contact: "Contact Us",
        hero_directions: "Get Directions",
        about_title: "Who We Are",
        about_text_1: "Doctor Biker Garage is a premier <strong>Motorcycle Accessories & Preparation Workshop</strong> in Casablanca. We specialize in customizing and preparing bikes for peak performance and style.",
        about_text_2: "We service all major brands including <strong>Honda, Yamaha, Kawasaki, BMW, KTM, Ducati, Suzuki, CFMOTO, and SYM</strong>. Whether it's diagnostics, repair, or a complete build, our passion drives every service.",
        stat_followers: "Followers",
        stat_rating: "Rating",
        stat_passion: "Passion",
        services_title: "Our Services",
        service_maint_title: "Maintenance",
        service_maint_desc: "Oil changes, filters, brake pads, and general tune-ups.",
        service_diag_title: "Diagnostics",
        service_diag_desc: "Advanced troubleshooting for electronic and mechanical systems.",
        service_custom_title: "Custom Builds",
        service_custom_desc: "Tailored modifications to turn your bike into a unique machine.",
        service_brakes_title: "Suspension & Brakes",
        service_brakes_desc: "Performance upgrades for track and street riding.",
        gallery_title: "Gallery",
        reviews_title: "What Riders Say",
        brands_title: "Brands & Partners",
        book_btn: "Book on WhatsApp",
        contact_title: "Get In Touch",
        contact_subtitle: "We'd love to hear from you",
        contact_hours: "Opening Hours",
        contact_mon_sat: "Tue - Sun: 11:40 AM - 7:00 PM",
        contact_sun: "Monday: Closed",
        contact_address: "Address",
        contact_phone: "Phone",
        footer_rights: "&copy; 2026 Doctor Biker Garage. All rights reserved.",
        footer_slogan: "Reviving Engines, Restoring Souls.",
        footer_slogan: "Reviving Engines, Restoring Souls.",
        stat_years: "Years Experience",
        feat_expert: "Technical Expertise",
        feat_diag: "Advanced Diagnostics",
        feat_parts: "Premium Parts",
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
