# Adham Cherkaoui Eddeqaqi — Portfolio

<div align="center">

[![Author](https://img.shields.io/badge/Author-0dh4m-2f5bff?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0dh4m)
[![Live Site](https://img.shields.io/badge/Live%20Portfolio-0dh4m.github.io-12b5a5?style=for-the-badge&logo=googlechrome&logoColor=white)](https://0dh4m.github.io/)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20Bootstrap%20%7C%20Canvas-e8b44a?style=for-the-badge)](https://github.com/0dh4m/0dh4m.github.io)

**The portfolio of Adham Cherkaoui Eddeqaqi (0dh4m) — software developer in Rabat, Morocco.**
Full-stack web, C# desktop, and real-time systems, presented with a Moroccan Futurism design language: horseshoe arches, zellige geometry, Majorelle blue and saffron.

[Live Site](https://0dh4m.github.io/) • [Projects](https://0dh4m.github.io/projects.html) • [Systems](#selected-systems) • [Demos](#demos) • [Author](#author--contact)

</div>

---

## Highlights

- **Moroccan Futurism design system**: ink, Majorelle blue, zellige teal, saffron and sand, with Sora, Plus Jakarta Sans and JetBrains Mono.
- **Horseshoe-arch portrait**: a custom SVG built from zellige geometry and an AC monogram.
- **Interactive zellige canvas**: a lightweight 2D particle field in the site palette, with reduced-motion support.
- **Four honest system case studies**: Watch Together, DualAudio Sync, TapoCam Viewer and Hotel Management, each with its real signal path and constraints.
- **Six curated projects on the home page** and a filterable directory of ten on `projects.html`.
- **Bilingual English / French** content with a persistent language switch.
- **No build step**: static HTML, CSS and vanilla JavaScript, deployed with GitHub Pages.

---

## Selected systems

| System | Domain | Stack |
| :--- | :--- | :--- |
| **Watch Together** | Synchronized viewing, chat and WebRTC voice | Node.js, Socket.IO, WebRTC, SQLite |
| **DualAudio Sync** | One Windows stream to Sonos + Bluetooth/AUX | Python, Flask, WASAPI, SoCo |
| **TapoCam Viewer** | Local-first camera viewer with ONVIF PTZ | Python, aiohttp, go2rtc, WebRTC |
| **Hotel Management** | Transactional bookings and invoicing | PHP 8, PDO, MySQL, Bootstrap |

The home page describes what each system actually does. It does not claim benchmarks or telemetry that the projects do not produce.

---

## Demos

Every demo is a static build under `demos/` and opens in a new tab:

| Demo | Path | Project |
| :--- | :--- | :--- |
| Watch Together | `demos/watch-together/` | Synchronized media room |
| CyberOps Academy | `demos/cyberops/` | Cybersecurity study platform |
| Happy Gym PRO | `demos/hmp/home.html` | Nutrition and meal planning |
| DualAudio Sync | `demos/dualaudio/` | Windows audio routing controller |
| DualLumi PRO | `demos/duallumi/` | BLE lighting dashboard |
| TapoCam Viewer | `demos/tapocam/` | Camera viewer UI |
| PharmaCare PRO | `demos/pharmacare/` | Pharmacy management demo |
| Hotel Management | `demos/hotel/` | Reservation and invoicing demo |
| Radio Maroc Live | `demos/radio-maroc/` | Moroccan radio player |
| Movies & Series | `demos/movies/` | Cinema catalog |

`demos/library/` contains an older BiblioTech library prototype that is not linked from the site.

Some demos are interface simulations. The README of each project states what is real and what is mocked.

---

## Repository layout

```text
0dh4m.github.io/
├── index.html                  # Home: hero, about, skills, systems, six projects, contact
├── projects.html               # Filterable directory of ten projects
├── cv_en.html                  # English web CV
├── cv_fr.html                  # French web CV
├── assets/
│   ├── css/
│   │   ├── style.css           # Design tokens and base components
│   │   └── home.css            # Home page layer
│   ├── js/                     # Theme, i18n, typewriter, canvas, project data
│   ├── cv/                     # English and French PDF CVs
│   └── img/                    # Arch portrait, zellige and khatam motifs
└── demos/                      # Static project demos
```

---

## Local development

Clone the repository and serve it with any static HTTP server:

```bash
git clone https://github.com/0dh4m/0dh4m.github.io.git
cd 0dh4m.github.io
python -m http.server 5500
```

Then open `http://localhost:5500`.

---

## Author & contact

**Adham Cherkaoui Eddeqaqi (0dh4m)**
Software developer · Specialized Technician in Software Development (MIAGE Rabat)
Rabat / Salé, Morocco

- GitHub: [@0dh4m](https://github.com/0dh4m)
- Website: [0dh4m.github.io](https://0dh4m.github.io/)
- Email: [0dh4mm@gmail.com](mailto:0dh4mm@gmail.com)
- WhatsApp: [+212 625-632628](https://wa.me/212625632628)

---

© 2026 Adham Cherkaoui Eddeqaqi (0dh4m). All rights reserved. See [LICENSE](LICENSE).
