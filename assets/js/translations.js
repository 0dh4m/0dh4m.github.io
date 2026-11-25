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
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      systems: "Systems",
      projects: "Projects",
      contact: "Contact"
    },
    hero: {
      eyebrow: "Moroccan Futurism · Rabat, MA",
      headline: "I build software that holds up in the real world.",
      subtitle: "I'm a software developer in Rabat, Morocco. I work across full-stack web, Windows desktop, and real-time systems — from the database schema to the last pixel.",
      btn_cv: "Download CV",
      btn_systems: "See selected systems",
      btn_contact: "Start a conversation",
      meta_location: "Rabat / Salé",
      meta_status: "Open to work"
    },
    hero_titles: ["Full-Stack Web Developer", "C# Desktop Developer", "Real-Time Systems Builder", "PHP & Node.js Engineer"],
    about: {
      kicker: "Get to know me",
      title: "About Me",
      heading: "From database schema to the last pixel.",
      p1: "I'm Adham, a software developer based in Rabat. I build and maintain full-stack web apps, Windows desktop tools, and small real-time systems. I care about clean data models, predictable behaviour, and interfaces that don't make people think twice.",
      p2: "My background in literature and human sciences taught me to ask better questions before writing code: who is this for, what happens when it fails, and what does the person in front of the screen actually need?",
      info: { name: "Full Name", location: "Location", email: "Email", status: "Status" },
      status_value: "Open to work",
      stats: { t1: "Public repos", t2: "Core stacks", t3: "Diploma" }
    },
    edu: {
      title: "Education & Qualifications",
      i1: {
        title: "Specialized Technician in Software Development",
        place: "MIAGE Rabat · Morocco",
        time: "2024 – 2026",
        desc: "Full-stack software engineering, relational database design (MySQL/PDO), OOP in C# and PHP, and software architecture."
      },
      i2: {
        title: "High School Baccalaureate — Literature & Human Sciences",
        place: "Lycée Abdellah Guennoun · Rabat, Morocco",
        time: "2023 – 2024",
        desc: "Cultivated strong critical reasoning, analytical thinking, and structured problem formulation."
      }
    },
    skills: {
      kicker: "What I work with",
      title: "A practical toolkit",
      cat1: "Languages & Core",
      cat2: "Desktop & Web UI",
      cat3: "Real-Time, Databases & APIs",
      cat4: "Tools & Automation"
    },
    projects_filter: {
      all: "All Projects (10)",
      web: "Web & Real-Time (4)",
      desktop: "Desktop & Hardware (4)",
      ai: "Cybersecurity & AI (2)"
    },
    projects: {
      kicker: "More work",
      title: "Other things I've built",
      subtitle: "A selection of real software I designed, built, and documented.",
      demo: "Live Demo",
      view_all: "View All Projects",
      c1: {
        tag: "Cybersecurity platform",
        desc: "A self-paced security study platform with 19 modules, in-browser labs, a 10-question exam simulator, and an optional AI mentor. The PHP/MySQL backend is optional; the app also runs from static files."
      },
      c2: {
        tag: "Nutrition & desktop",
        desc: "A PFE nutrition and meal-planning ecosystem: a C# WPF desktop planner, a PHP 8 web app, and a Gemini-powered meal service. Macro calculator, saved meals, and WhatsApp sharing."
      },
      c3: {
        tag: "BLE hardware",
        desc: "A Windows tray app and PyQt6 UI for ELK-BLEDOM / KeepSmile BLE lights, with scene presets, a floating mini HUD, and an Electron shell that manages the Python backend."
      },
      c4: {
        tag: "PHP catalog",
        desc: "A PHP 8 + MySQL catalog for movies and series with genre filters, title search, local favorites, and third-party embed playback. The repository ships no media files."
      },
      c5: {
        tag: "Live radio",
        desc: "A single-page player for 24 Moroccan radio stations with search, local favorites, and a Web Audio visualizer. No backend and no build step."
      },
      c6: {
        tag: "Pharmacy demo",
        desc: "A browser-side pharmacy demo with patient records, stock, Gemini Vision prescription scanning, and a Chart.js dashboard. Persistence is local to the browser."
      }
    },
    projects_page: {
      kicker: "Portfolio Showcase",
      title: "All Projects & Systems",
      subtitle: "Every software application and platform I have designed, engineered, and shipped. Filter by technology or domain.",
      back_home: "Back to Home",
      more: "More systems are in progress — follow the work on GitHub.",
      github_cta: "Visit GitHub"
    },
    systems: {
      kicker: "Selected systems",
      title: "Built to be used, not just demoed.",
      subtitle: "Four projects that show how I think about state, latency, and failure.",
      repo: "Repo",
      s1: {
        domain: "Real-time web",
        title: "Watch Together",
        desc: "A synchronized viewing room with host controls, chat, and WebRTC voice. The hard part is not the player — it is keeping every client honest when the network is not."
      },
      s2: {
        domain: "Windows audio",
        title: "DualAudio Sync",
        desc: "Routes one Windows audio stream to a Sonos speaker and a Bluetooth/AUX speaker at the same time, with a delay line calibrated by ear."
      },
      s3: {
        domain: "Local-first video",
        title: "TapoCam Viewer",
        desc: "A private viewer for a Tapo C510W. go2rtc handles the WebRTC stream, a Python server handles config and ONVIF PTZ, and the browser gets a PIN-locked view."
      },
      s4: {
        domain: "Transactional CRUD",
        title: "Hotel Management",
        desc: "Rooms, guests, reservations and invoices in PHP 8. The booking path rejects overlapping dates and writes the reservation and room status in one PDO transaction."
      }
    },
    github: {
      kicker: "The rest of the work",
      title: "Public repositories, documented.",
      text: "Setup notes, licenses, and honest scopes. If a project is not finished, the README says so."
    },
    contact: {
      kicker: "Let's connect",
      title: "Get In Touch",
      subtitle: "Have a software project in mind, an opportunity, or a question? My inbox is open.",
      info_title: "Contact Details",
      info_text: "Reach me directly by phone or email. I usually reply within 24 hours.",
      location: "Rabat / Salé, Morocco",
      form: { name: "Full Name", email: "Email Address", subject: "Subject", message: "Your Message", send: "Send Message" },
      ph: { name: "Enter your name", email: "Enter your email", subject: "What is this regarding?", message: "Write your message here..." },
      success: "Thank you. Your message has been validated locally — please email me directly so I actually receive it.",
      form_note: "This form validates locally and does not send yet. For a real reply, use email or phone."
    },
    footer: {
      made: "Designed & engineered by 0dh4m (Adham Cherkaoui Eddeqaqi).",
      rights: "All rights reserved.",
      tagline: "Software, systems, and a little zellige. Built in Rabat."
    }
  },

  /* ------------------------------ FRENCH ------------------------------ */
  fr: {
    cv_banner: {
      title: "Besoin d'un CV officiel ?",
      subtitle: "Version PDF en Français & Anglais",
      preview: "Aperçu du CV"
    },
    nav: {
      home: "Accueil",
      about: "À propos",
      skills: "Compétences",
      systems: "Systèmes",
      projects: "Projets",
      contact: "Contact"
    },
    hero: {
      eyebrow: "Futurisme marocain · Rabat, MA",
      headline: "Je construis des logiciels qui tiennent dans le monde réel.",
      subtitle: "Développeur informatique à Rabat, Maroc. Je travaille sur le web full-stack, le desktop Windows et les systèmes temps réel — du schéma de base de données au dernier pixel.",
      btn_cv: "Télécharger CV",
      btn_systems: "Voir les systèmes",
      btn_contact: "Discutons",
      meta_location: "Rabat / Salé",
      meta_status: "Ouvert aux opportunités"
    },
    hero_titles: ["Développeur Web Full-Stack", "Développeur Desktop C#", "Architecte Systèmes Temps Réel", "Développeur PHP & Node.js"],
    about: {
      kicker: "Faisons connaissance",
      title: "À Propos de Moi",
      heading: "Du schéma de base de données au dernier pixel.",
      p1: "Je suis Adham, développeur informatique basé à Rabat. Je conçois et maintiens des applications web full-stack, des outils desktop Windows et de petits systèmes temps réel. J'accorde de l'importance aux modèles de données propres, au comportement prévisible et aux interfaces qui ne font pas réfléchir deux fois.",
      p2: "Ma formation en lettres et sciences humaines m'a appris à poser de meilleures questions avant d'écrire du code : à qui cela sert-il, que se passe-t-il en cas d'échec, et de quoi la personne devant l'écran a-t-elle vraiment besoin ?",
      info: { name: "Nom complet", location: "Localisation", email: "E-mail", status: "Statut" },
      status_value: "À l'écoute d'opportunités",
      stats: { t1: "Dépôts publics", t2: "Stacks principales", t3: "Diplôme" }
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
      kicker: "Ce que j'utilise",
      title: "Une boîte à outils concrète",
      cat1: "Langages & Fondamentaux",
      cat2: "Desktop & Interfaces Web",
      cat3: "Temps Réel, Bases de Données & APIs",
      cat4: "Outils & Automatisation"
    },
    projects_filter: {
      all: "Tous les projets (10)",
      web: "Web & Temps Réel (4)",
      desktop: "Desktop & Matériel (4)",
      ai: "Cybersécurité & IA (2)"
    },
    projects: {
      kicker: "Autres réalisations",
      title: "D'autres choses que j'ai construites",
      subtitle: "Une sélection de logiciels réels que j'ai conçus, développés et documentés.",
      demo: "Démo Live",
      view_all: "Voir tous mes projets",
      c1: {
        tag: "Plateforme cybersécurité",
        desc: "Une plateforme d'étude de la cybersécurité en autonomie : 19 modules, des laboratoires dans le navigateur, un simulateur d'examen de 10 questions et un mentor IA optionnel. Le backend PHP/MySQL est optionnel ; l'application fonctionne aussi en fichiers statiques."
      },
      c2: {
        tag: "Nutrition & desktop",
        desc: "Un écosystème de nutrition et de planification de repas (PFE) : un planificateur desktop C# WPF, une application web PHP 8 et un service de repas propulsé par Gemini. Calculateur de macros, repas enregistrés et partage WhatsApp."
      },
      c3: {
        tag: "Matériel BLE",
        desc: "Une application de barre système Windows et une interface PyQt6 pour les lampes BLE ELK-BLEDOM / KeepSmile, avec des scènes prédéfinies, un mini HUD flottant et un shell Electron qui gère le backend Python."
      },
      c4: {
        tag: "Catalogue PHP",
        desc: "Un catalogue PHP 8 + MySQL de films et séries avec filtres par genre, recherche par titre, favoris locaux et lecture via des lecteurs embarqués tiers. Le dépôt ne contient aucun fichier média."
      },
      c5: {
        tag: "Radio en direct",
        desc: "Un lecteur monopage de 24 radios marocaines avec recherche, favoris locaux et visualiseur Web Audio. Sans backend ni étape de build."
      },
      c6: {
        tag: "Démo pharmacie",
        desc: "Une démo de pharmacie côté navigateur avec dossiers patients, stock, numérisation d'ordonnances par Gemini Vision et tableau de bord Chart.js. La persistance est locale au navigateur."
      }
    },
    projects_page: {
      kicker: "Galerie de Projets",
      title: "Tous Mes Projets & Systèmes",
      subtitle: "L'ensemble des applications et plateformes que j'ai réalisées — web, desktop et temps réel. Nouveaux projets ajoutés en continu.",
      back_home: "Retour à l'accueil",
      more: "D'autres systèmes sont en cours — suivez le travail sur GitHub.",
      github_cta: "Voir sur GitHub"
    },
    systems: {
      kicker: "Systèmes sélectionnés",
      title: "Conçus pour servir, pas seulement pour la démo.",
      subtitle: "Quatre projets qui montrent comment je pense l'état, la latence et l'échec.",
      repo: "Dépôt",
      s1: {
        domain: "Web temps réel",
        title: "Watch Together",
        desc: "Une salle de visionnage synchronisée avec contrôle hôte, chat et voix WebRTC. Le plus dur n'est pas le lecteur : c'est de garder chaque client aligné quand le réseau ne l'est pas."
      },
      s2: {
        domain: "Audio Windows",
        title: "DualAudio Sync",
        desc: "Diffuse un même flux audio Windows vers une enceinte Sonos et une enceinte Bluetooth/AUX en même temps, avec une ligne de retard calibrée à l'oreille."
      },
      s3: {
        domain: "Vidéo locale",
        title: "TapoCam Viewer",
        desc: "Une visionneuse privée pour une Tapo C510W. go2rtc gère le flux WebRTC, un serveur Python gère la configuration et le PTZ ONVIF, et le navigateur affiche une vue protégée par code PIN."
      },
      s4: {
        domain: "CRUD transactionnel",
        title: "Gestion d'hôtel",
        desc: "Chambres, clients, réservations et factures en PHP 8. Le parcours de réservation refuse les dates qui se chevauchent et écrit la réservation et le statut de la chambre dans une seule transaction PDO."
      }
    },
    github: {
      kicker: "Le reste du travail",
      title: "Des dépôts publics, documentés.",
      text: "Des notes d'installation, des licences et des périmètres honnêtes. Si un projet n'est pas terminé, le README le dit."
    },
    contact: {
      kicker: "Collaborons ensemble",
      title: "Contactez-moi",
      subtitle: "Un projet à concrétiser, une opportunité professionnelle ou une question ? Ma boîte mail est ouverte.",
      info_title: "Coordonnées",
      info_text: "Joignez-moi directement par téléphone ou e-mail. Je réponds généralement sous 24 h.",
      location: "Rabat / Salé, Maroc",
      form: { name: "Nom complet", email: "Adresse e-mail", subject: "Sujet", message: "Votre message", send: "Envoyer le message" },
      ph: { name: "Entrez votre nom", email: "Entrez votre e-mail", subject: "Sujet de votre message", message: "Écrivez votre message ici..." },
      success: "Merci. Votre message a été validé localement — écrivez-moi directement par e-mail pour que je le reçoive vraiment.",
      form_note: "Ce formulaire valide localement et n'envoie rien pour l'instant. Pour une vraie réponse, utilisez l'e-mail ou le téléphone."
    },
    footer: {
      made: "Conçu et développé par 0dh4m (Adham Cherkaoui Eddeqaqi).",
      rights: "Tous droits réservés.",
      tagline: "Du logiciel, des systèmes et un peu de zellige. Construit à Rabat."
    }
  }
};
