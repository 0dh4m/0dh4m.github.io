/* ==========================================================================
   Portfolio Translations — English (default) / French
   Used by main.js : elements carry data-i18n="section.key"
   ========================================================================== */
const translations = {

  /* ------------------------------ ENGLISH ------------------------------ */
  en: {
    cv_banner: {
      title: "Need a formal CV?",
      subtitle: "PDF version in English & French",
      preview: "Preview CV"
    },
    nav: { home: "Home", about: "About", skills: "Skills", architecture: "Architecture", projects: "Projects", contact: "Contact" },
    hero: {
      badge: "Available for new opportunities",
      greeting: "Hi, I'm",
      subtitle: "Software Developer based in Rabat, Morocco. I architect and build reliable full-stack web platforms, real-time media systems, and high-performance C# desktop applications.",
      btn_cv: "Download CV",
      btn_projects: "Explore My Work",
      scroll: "Scroll down"
    },
    hero_titles: ["Full-Stack Web Developer", "C# Desktop Developer", "Real-Time Systems Builder", "PHP & Node.js Engineer"],
    about: {
      kicker: "Get to know me",
      title: "About Me",
      heading: "A developer who engineers reliable code & solves real problems",
      p1: "I'm Adham Cherkaoui Eddeqaqi, a Software Developer from Rabat, Morocco, holding a Specialized Technician Diploma in Software Development from MIAGE Rabat. I build complete end-to-end solutions — from PHP/MySQL and Node.js/Socket.IO back-ends to responsive web front-ends, C# WPF desktop software, and Python automation.",
      p2: "My Baccalaureate in Literature & Human Sciences provides me with a strong analytical edge: structured logical reasoning, clear problem definition, and the ability to turn complex business requirements into clean, user-friendly software.",
      info: { name: "Full Name", location: "Location", email: "Email", status: "Status" },
      status_value: "Open to work",
      stats: { t1: "Technologies", t2: "Major Projects", t3: "Degree" },
      hl1: { title: "Analytical Rigor + Tech", text: "A balanced blend of analytical mindset and full-stack software engineering — delivering maintainable, well-structured architectures." }
    },
    edu: {
      title: "Education & Qualifications",
      i1: {
        title: "Specialized Technician in Software Development",
        place: "MIAGE Rabat · Morocco",
        time: "2024 – 2026",
        desc: "Full-stack software engineering, relational database architecture (SQL / MySQL / PDO), object-oriented programming in C# and PHP, and software design patterns."
      },
      i2: {
        title: "High School Baccalaureate — Literature & Human Sciences",
        place: "Lycée Abdellah Guennoun · Rabat, Morocco",
        time: "2023 – 2024",
        desc: "Cultivated strong critical reasoning, analytical thinking, and structured problem formulation."
      }
    },
    skills: {
      kicker: "My technical toolbox",
      title: "Skills & Technologies",
      cat1: "Languages & Core",
      cat2: "Desktop & Web UI",
      cat3: "Real-Time, Databases & APIs",
      cat4: "Tools & Automation"
    },
        projects_filter: {
      all: "All Powerhouse Systems (10)",
      web: "Web & Real-Time (4)",
      desktop: "Desktop & Hardware IoT (4)",
      ai: "Cybersecurity & AI (2)"
    },
    projects: {
      kicker: "Featured Work",
      title: "Highlighted Projects",
      subtitle: "A curated selection of real-world software applications I architected, developed, and delivered.",
      p1: {
        tag: "Real-Time Web & PWA",
        title: "Watch Together — Synced Streaming",
        desc: "Sub-second synchronized media playback (<1.5s drift correction) with low-latency WebRTC mesh voice rooms, real-time WebSocket chat, and multi-source streaming hub."
      },
      p2: {
        tag: "AI Web & Desktop App",
        title: "Happy Gym PRO (PFE)",
        desc: "Synchronized fitness nutrition ecosystem: PHP 8 Web app + C# .NET WPF native desktop app with Gemini 1.5 multimodal photo recognition and WhatsApp OTP password recovery."
      },
      p3: {
        tag: "Management System & AI",
        title: "PharmaCare — Pharmacy Management",
        desc: "Complete pharmacy suite with patient records, Gemini Vision OCR prescription scanning, visitor audit logging, client blacklist, and dynamic live analytics dashboard."
      },
      p4: {
        tag: "Live Streaming Web App",
        title: "Radio Maroc Live",
        desc: "High-performance SPA streaming 24 live Moroccan radio stations with zero-interruption playback, instant search, LocalStorage favorites, and audio equalizer."
      },
      demo: "Live Demo",
      view_all: "View All Projects"
    },
    projects_page: {
      kicker: "Portfolio Showcase",
      title: "All Projects & Systems",
      subtitle: "Every software application and platform I have designed, engineered, and shipped. Filter by technology or domain.",
      back_home: "Back to Home",
      more: "More exciting systems in active development — follow my work on GitHub.",
      github_cta: "Visit GitHub"
    },
    contact: {
      kicker: "Let's connect",
      title: "Get In Touch",
      subtitle: "Have a software project in mind, an opportunity, or looking for a passionate developer? My inbox is always open.",
      info_title: "Contact Details",
      info_text: "Feel free to reach out directly via phone or email — I usually respond within 24 hours.",
      location: "Rabat / Salé, Morocco",
      follow: "Find Me Online",
      form: { name: "Full Name", email: "Email Address", subject: "Subject", message: "Your Message", send: "Send Message" },
      ph: { name: "Enter your name", email: "Enter your email", subject: "What is this regarding?", message: "Write your message here..." },
      success: "Thank you! Your message has been sent successfully. I will get back to you shortly."
    },
    footer: { made: "Designed & Engineered by 0dh4m (Adham Cherkaoui Eddeqaqi)", rights: "All rights reserved. Copyright © 2026 0dh4m." }
  },

  /* ------------------------------ FRENCH ------------------------------ */
  fr: {
    cv_banner: {
      title: "Besoin d'un CV officiel ?",
      subtitle: "Version PDF en Français & Anglais",
      preview: "Aperçu du CV"
    },
    nav: { home: "Accueil", about: "À propos", skills: "Compétences", architecture: "Architecture", projects: "Projets", contact: "Contact" },
    hero: {
      badge: "Disponible pour de nouvelles opportunités",
      greeting: "Bonjour, je suis",
      subtitle: "Développeur Informatique basé à Rabat, Maroc. Je conçois et développe des plateformes web réactives, des systèmes temps réel et des applications desktop C# performantes.",
      btn_cv: "Télécharger CV",
      btn_projects: "Découvrir mes projets",
      scroll: "Défiler vers le bas"
    },
    hero_titles: ["Développeur Web Full-Stack", "Développeur Desktop C#", "Architecte Systèmes Temps Réel", "Développeur PHP & Node.js"],
    about: {
      kicker: "Faisons connaissance",
      title: "À Propos de Moi",
      heading: "Un développeur qui allie rigueur technique et sens pratique",
      p1: "Je m'appelle Adham Cherkaoui Eddeqaqi, Développeur Informatique basé à Rabat, diplômé Technicien Spécialisé en Développement Informatique à l'institut MIAGE Rabat. Je développe des solutions logicielles de bout en bout — des back-ends PHP/MySQL et Node.js/Socket.IO aux interfaces web modernes, applications bureautiques natives Windows en C# WPF et scripts d'automatisation Python.",
      p2: "Mon Baccalauréat en Lettres et Sciences Humaines m'apporte une réelle valeur ajoutée : une grande capacité d'analyse, un raisonnement logique rigoureux et une aisance pour traduire des besoins métiers complexes en logiciels simples et efficaces.",
      info: { name: "Nom complet", location: "Localisation", email: "E-mail", status: "Statut" },
      status_value: "À l'écoute d'opportunités",
      stats: { t1: "Technologies", t2: "Projets majeurs", t3: "Diplôme" },
      hl1: { title: "Rigueur Analytique + Tech", text: "Une combinaison équilibrée d'esprit d'analyse et de compétences techniques full-stack — garantissant des architectures robustes et pérennes." }
    },
    edu: {
      title: "Formations & Diplômes",
      i1: {
        title: "Technicien Spécialisé en Développement Informatique",
        place: "MIAGE Rabat · Maroc",
        time: "2024 – 2026",
        desc: "Développement full-stack, modélisation relationnelle (SQL / MySQL / PDO), programmation orientée objet en C# et PHP, et patrons de conception logicielle."
      },
      i2: {
        title: "Baccalauréat — Lettres et Sciences Humaines",
        place: "Lycée Abdellah Guennoun · Rabat, Maroc",
        time: "2023 – 2024",
        desc: "Développement de l'esprit critique, analyse conceptuelle et formulation méthodique des problématiques."
      }
    },
    skills: {
      kicker: "Ma boîte à outils",
      title: "Compétences & Technologies",
      cat1: "Langages & Fondamentaux",
      cat2: "Desktop & Interfaces Web",
      cat3: "Temps Réel, Bases de Données & APIs",
      cat4: "Outils & Automatisation"
    },
        projects_filter: {
      all: "Tous les Systèmes Majeurs (10)",
      web: "Web & Temps Réel (4)",
      desktop: "Desktop & Matériel IoT (4)",
      ai: "Cybersécurité & IA (2)"
    },
    projects: {
      kicker: "Mes réalisations",
      title: "Projets à la Une",
      subtitle: "Une sélection de solutions logicielles concrètes que j'ai conçues, développées et déployées.",
      p1: {
        tag: "Web Temps Réel & PWA",
        title: "Watch Together — Streaming Synchronisé",
        desc: "Visionnage vidéo synchronisé à la milliseconde (<1.5s de dérive) avec salons vocaux WebRTC à faible latence, chat WebSocket instantané et support de 7 sources multimédias."
      },
      p2: {
        tag: "Application Web & Desktop IA",
        title: "Happy Gym PRO (PFE)",
        desc: "Écosystème de nutrition sportive synchronisé : Web PHP 8 + Desktop natif Windows C# WPF, reconnaissance d'ingrédients par l'IA Gemini 1.5 et OTP WhatsApp."
      },
      p3: {
        tag: "Système de Gestion & IA",
        title: "PharmaCare — Gestion de Pharmacie",
        desc: "Suite logicielle officinale : dossiers patients, numérisation d'ordonnances par IA (Gemini Vision OCR), journal d'audit des visites, liste noire et tableau de bord en direct."
      },
      p4: {
        tag: "Application Web Streaming",
        title: "Radio Maroc Live",
        desc: "Plateforme audio SPA diffusant 24 radios marocaines en direct sans coupure lors de la navigation, avec recherche instantanée, favoris LocalStorage et égaliseur animé."
      },
      demo: "Démo Live",
      view_all: "Voir tous mes projets"
    },
    projects_page: {
      kicker: "Galerie de Projets",
      title: "Tous Mes Projets & Systèmes",
      subtitle: "L'ensemble des applications et plateformes que j'ai réalisées — web, desktop et temps réel. Nouveaux projets ajoutés en continu.",
      back_home: "Retour à l'accueil",
      more: "D'autres projets sont en cours de développement — suivez mon GitHub pour rester informé.",
      github_cta: "Voir sur GitHub"
    },
    contact: {
      kicker: "Collaborons ensemble",
      title: "Contactez-moi",
      subtitle: "Un projet à concrétiser, une opportunité professionnelle ou une question ? Je suis à votre écoute.",
      info_title: "Coordonnées",
      info_text: "N'hésitez pas à me joindre directement par téléphone ou e-mail — je réponds généralement sous 24h.",
      location: "Rabat / Salé, Maroc",
      follow: "Réseaux & Liens",
      form: { name: "Nom complet", email: "Adresse e-mail", subject: "Sujet", message: "Votre message", send: "Envoyer le message" },
      ph: { name: "Entrez votre nom", email: "Entrez votre e-mail", subject: "Sujet de votre message", message: "Écrivez votre message ici..." },
      success: "Merci ! Votre message a été envoyé avec succès. Je vous répondrai très rapidement."
    },
    footer: { made: "Conçu et développé par 0dh4m (Adham Cherkaoui Eddeqaqi)", rights: "Tous droits réservés. Copyright © 2026 0dh4m." }
  }
};
