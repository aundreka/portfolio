window.PROJECTS_DATA = window.PROJECTS_DATA || {};

window.PROJECTS_DATA.RAW_PROJECTS = [
  {
    "title": "PRISM (Personalized Real-time Intelligent Segmentation for Marketing)",
    "month": 10,
    "day": 15,
    "year": 2025,
    "description": "An algorithm-driven scheduling and recommendation tool for Philippine SMEs and creators that pairs temporal engagement signals with contextual Thompson Sampling to surface posting and content strategy suggestions via an interpretable mobile view.",
    "context": "Built during a tight grant sprint with patchy SME data, so I instrumented engagement heuristics and layered Thompson Sampling walk-forward tests to keep the mobile view responsive even when the signals lagged.",
    "language": "react native",
    "category": "apps",
    "icons": [
      "react",
      "expo",
      "figma",
      "supabase"
    ],
    "note": "c",
    "keyBg": "assets/projects/prism/key.jpg",
    "media": {
      "big": "assets/projects/prism.jpg"
    },
    "links": {
      "github": "https://github.com/aundreka/prism",
      "docs": "https://drive.google.com/drive/folders/1iqKNayNYbg8pU5p6TRbB0Ny091hfXNEO?usp=sharing",
      "uiMockup": "https://www.figma.com/design/iraXiOnrekFEGtbgxLtBEU/prism?node-id=19-392&t=qUPDXqz5N755vxFH-0"
    }
  },
  {
    "title": "SchEDU Teach",
    "month": 3,
    "day": 26,
    "year": 2026,
    "description": "A rule-based academic planning system that converts uploaded documents into structured lesson notes, quizzes, and weekly schedules across multiple document types.",
    "context": "Document uploads came in noisy, non-standard formats, so I built a resilient parser with cascading fallback rules and verbose logging to debug why a few PDFs kept breaking the quiz generator.",
    "language": "react native",
    "category": "apps",
    "icons": [
      "react",
      "expo",
      "python",
      "tensorflow",
      "figma",
      "supabase"
    ],
    "note": "d",
    "media": {
      "big": "assets/projects/schedu-teach.jpg"
    },
    "links": {
      "github": "https://github.com/aundreka/schedu-teach",
      "docs": "https://drive.google.com/drive/folders/1KZuNWqPrXMu8PlsXENSDBScind6pnMOF?usp=sharing",
      "uiMockup": "https://www.figma.com/design/1LSUfW48U0wXTKsDdBm1cV/schedu?node-id=0-1&p=f&t=qUPDXqz5N755vxFH-0"
    }
  },
  {
    "title": "GABAY: A Crisis-Focused News and Information App for Filipinos",
    "month": 8,
    "day": 18,
    "year": 2025,
    "description": "Submitted to the 2025 UNESCO Youth Hackathon, Gavay is a mobile application that delivers verified, real-time crisis information.",
    "context": "Reliable info pipelines kept failing during the hackathon prototype demo, so I introduced short-lived caching and manual verification layers that let the app stay online long enough to prove the idea.",
    "language": "react native",
    "category": "apps",
    "icons": [
      "react",
      "expo",
      "supabase"
    ],
    "note": "f",
    "keyBg": "assets/projects/gabay/key.jpg",
    "media": {
      "big": "assets/projects/gabay.png",
    },
    "links": {
      "docs": "https://drive.google.com/drive/folders/1NdTMzKL0_ak6hJD9LTJCdgJTsqZLPl57?usp=sharing",
      "uiMockup": "https://www.figma.com/design/hZG1YbAmL4T1ZTKvcATiZq/GABAY?node-id=1-2&p=f&t=rcwHgPFlvFyuKtuR-0"
    }
  },

  {
    "title": "AstraiOS Lunar Calendar System",
    "month": 1,
    "day": 15,
    "year": 2024,
    "description": "AstraiOS Lunar Calendar System is a personalized application designed to offer users unique tarot readings and lunar calendar insights based on their birthdate by integrating astrology, lunar phases, and tarot readings.",
    "context": "Mapping celestial data proved fiddly, so I leaned on open-source ephemeris tables and utility scripts that reconciled timezone quirks before rendering the tarot visuals.",
    "language": "python",
    "category": "apps",
    "icons": [
      "python",
    ],
    "note": "a",
    "keyBg": "assets/projects/tarot/key.jpg",
    "media": {
      "big": "assets/projects/astraios.png",
    },
    "links": {
      "github": "https://github.com/aundreka/astraios",
      "docs": "https://drive.google.com/drive/folders/1iK1Q3XleyvRnFEJxEwKfSQuT0tiM1We6?usp=sharing",
    }
  },
  {
    "title": "AunDon Matchmaking Services",
    "month": 4,
    "day": 22,
    "year": 2024,
    "description": "A comprehensive matchmaking system that allows users to connect based on shared interests. The system will store various personal details and preferences, matching individuals who have common hobbies and personality traits.",
    "context": "The matching rules kept returning odd pairings because of inconsistent preference data, so I normalized the inputs and layered a scoring pipeline that biased towards verified interests.",
    "language": "python",
    "category": "apps",
    "icons": [
      "python",
        ],
    "note": "b",
    "keyBg": "assets/projects/dating/key.jpg",
    "media": {
      "big": "assets/projects/aundon.png",

    },
    "links": {
      "github": "https://github.com/aundreka/aundon-matchmaking-services",
      "docs": "https://drive.google.com/drive/folders/1lL94r6IGeknGW7iToqh13mnP0Dz3xIVp?usp=sharing",
    }
  },
  
  {
    "title": "Winderella: Mirroring Wind Hazard Detection System",
    "month": 11,
    "day": 6,
    "year": 2025,
    "description": "Winderella is a low-cost, real-time wind hazard detection and visualization system designed to provide hyperlocal, accessible, and reliable wind monitoring, especially for disaster-prone communities.",
    "context": "Sensor noise made the first demos look jittery, so I smoothed the readings in the data pipeline while keeping the alert latency below five seconds to demonstrate usability.",
    "language": "flutter",
    "category": "apps",
    "icons": [
      "flutter",
      "dart",
      "cpp"
    ],
    "note": "d#",
    "keyBg": "assets/projects/weather-app/key.jpg",
    "media": {
      "big": "assets/projects/winderella.png",
    },
    "links": {
      "github": "https://github.com/aundreka/winderella",
      "docs": "https://drive.google.com/drive/folders/1L04-hhaMS94WntXcTwHto2HXHskvgWnb?usp=sharing",
    }
  },
  {
    "title": "Pirate's Blood Bank Management System",
    "month": 12,
    "day": 21,
    "year": 2024,
    "description": "A campus-oriented app concept for donor info, inventory browsing, and request/appointment flow.",
    "context": "Managing donated blood data meant extra validation, so I added audit logs and input sanitizers that doubled as safeguards when the inventory workflow glitched during live testing.",
    "language": "php",
    "category": "apps",
    "icons": [
      "php",
      "mysql"
    ],
    "note": "f#",
    "keyBg": "assets/projects/bloodbank-app/key.jpg",
    "media": {
      "big": "assets/projects/pbbms.png",
    },
    "links": {
      "github": "https://github.com/aundreka/pirate-s-blood-bank-management-system",
      "docs": "https://drive.google.com/drive/folders/1PQWbpqSwkTS2HSNq6bHgqn6h7IgISRTG?usp=sharing",
      "live": "https://pbbms.gt.tc/login.php"
    }
  },
  {
    "title": "Ju-On: Cursebreaker",
    "month": 7,
    "day": 14,
    "year": 2025,
    "description": "Enter the world of Cursebreaker, a horror visual novel that draws inspiration from the terrifying legacy of JU-ON. You awaken inside a house steeped in rage and death, where every shadow hides a presence that watches, waits, and hunts.",
    "context": "Story branching and asset loading were choking the game on low-end devices, so I refactored the Python backend to preload only the next scene and turned the majority of the audio cues into streamed fragments.",
    "language": "Javascript",
    "category": "games",
    "icons": [
      "python",
      "javascript"
    ],
    "note": "e",
    "keyBg": "assets/projects/juon/key.jpg",
    "media": {
      "big": "assets/projects/juon.png",

    },
    "links": {
      "apk": "https://drive.google.com/drive/folders/1zdOgelKaZ0Plcp6A7jOC5M8KhPS57Pln?usp=sharing",
      "live": "https://aundreka.itch.io/ju-on-cursebreaker"
    }
  },
  {
    "title": "CS301 Tower Defense",
    "month": 12,
    "day": 1,
    "year": 2025,
    "description": "A tower defense game with strategic placement and enemy waves using the class of CS301 batch 2025-2026 as playable units.",
    "context": "Syncing the class roster with wave logic caused sporadic crashes, so I separated the data model from the rendering loop and added defensive checks that kept the demo playable.",
    "language": "flutter",
    "category": "games",
    "icons": [
      "flutter",
      "dart"
    ],
    "note": "g#",
    "keyBg": "assets/projects/tower-defense/key.jpg",
    "media": {
      "big": "assets/projects/cs301td.png",

    },
    "links": {
      "github": "https://github.com/aundreka/cs301td-flutter",
      "live": "https://aundreka.github.io/cs301td-flutter//"
    }
  },
  {
    "title": "Grimm Runner",
    "month": 11,
    "day": 19,
    "year": 2025,
    "description": "A survival game with movement/combat loops, expanding maps, and performance-focused gameplay logic.",
    "context": "The first build stuttered under complex maps, so I profiled the Flutter renderer and throttled updates on non-critical layers while optimizing enemy spawn logic.",
    "language": "flutter",
    "category": "games",
    "icons": [
      "flutter",
      "dart"
    ],
    "note": "a#",
    "keyBg": "assets/projects/grimm-runner/key.jpg",
    "media": {
      "big": "assets/projects/grimmrunner.png",
    },
    "links": {
      "github": "https://github.com/aundreka/appdev-finalproj",
      "docs": "https://drive.google.com/drive/folders/1Z9LieA0C9cNOS2pa3Vq5uY11uzJxZ3KZ?usp=sharing",
      "live": "https://aundreka.github.io/appdev-finalproj/"
    }
  },
  {
    "title": "TreeQuest: An Educational Game on Tree Traversals",
    "month": 8,
    "day": 6,
    "year": 2024,
    "description": "TreeQuest is an educational web-based game designed to help students understand tree traversals in a fun and interactive way. It was created as a learning aid for classmates to better grasp traversal concepts through gameplay rather than traditional lectures.",
    "context": "Translating recursive traversal logic into an interactive game loop caused timing glitches, so I added step-by-step animation queues and throttled input to keep the lesson paced.",
    "language": "javascript",
    "category": "games",
    "icons": [
      "javascript"
    ],
    "note": "b#",
    "keyBg": "assets/projects/tree-traversal/key.jpg",
    "media": {
      "big": "assets/projects/treequest.png",

    },
    "links": {
      "github": "https://github.com/aundreka/treequest",
      "live": "https://aundreka.github.io/treequest/"
    }
  },
  {
    "title": "Beth Aven E-commerce Website",
    "month": 12,
    "day": 10,
    "year": 2024,
    "description": "A responsive site focused on layout, typography, and clean section-based presentation.",
    "context": "My initial typography scale felt off on different browsers, so I reworked the CSS variables and retested spacing before lock-in.",
    "language": "php",
    "category": "websites",
    "icons": [
      "php",
      "mysql",
      "javascript"
    ],
    "note": "c",
    "keyBg": "assets/projects/beth-aven/key.jpg",
    "media": {
      "big": "assets/projects/bethaven.png",

    },
    "links": {
      "github": "https://github.com/aundreka/bethaven",
      "live": "https://bethaven.gt.tc/"
    }
  },
  {
    "title": "Gabriel - UI Design",
    "month": 8,
    "day": 4,
    "year": 2024,
    "description": "A personal website emphasizing UI polish, sections, and interactive presentation of work.",
    "context": "Polishing the UI meant balancing interactivity with load time, so I swapped large GIFs for SVG sequences and added staged reveals that hid heavy content until needed.",
    "language": "ui design",
    "category": "ui/ux",
    "icons": [
      "figma"
    ],
    "note": "d",
    "keyBg": "assets/projects/gabriel-site/key.jpg",
    "media": {
      "big": "assets/projects/gabriel.png",
    },
        "links": {
      "uiMockup": "https://drive.google.com/drive/folders/19OJPe5VBEu_JsPOuODvUponVKU5IQJjL?usp=sharing",
    }
  },
  {
    "title": "League of Legends Fan Website",
    "month": 9,
    "day": 17,
    "year": 2024,
    "description": "This is a League of Legends / Arcane fan experience built with PHP, MySQL, and handcrafted styling. The site centres on the Runeterra lore and gives visitors a Piltover/Zaun‑flavoured landing page, gated character explorations, and light admin management for the crew that keeps the community running.",
    "context": "Gated content broke when I tried to cache too aggressively, so I tuned the PHP session handling and added server-side guards to keep the lore pages consistent.",
    "language": "html css js",
    "category": "websites",
    "icons": [
      "html",
      "css",
      "javascript"
    ],
    "note": "e",
    "keyBg": "assets/projects/lol-login/key.jpg",
    "media": {
      "big": "assets/projects/arcane.png",
    },
    "links": {
      "github": "https://github.com/aundreka/arcane-fansite",
      "live": "https://arcane.gamer.gd/"
    }
  },
  {
    "title": "Diversity Globe: Informational Website",
    "month": 2,
    "day": 21,
    "year": 2024,
    "description": "A content-forward site with structured sections, visual hierarchy, and accessible navigation.",
    "context": "Getting the accessibility states right took a few iterations, so I reworked the navigation landmarks and added keyboard-only checks before unveiling the final layout.",
    "language": "html css js",
    "category": "websites",
    "icons": [
      "html",
      "css",
      "javascript"
    ],
    "note": "g",
    "keyBg": "assets/projects/diversity-globe/key.jpg",
    "media": {
      "big": "assets/projects/diversityglobe.png",
    },
    "links": {
      "github": "https://github.com/aundreka/diversityglobe",
      "live": "https://aundreka.github.io/diversityglobe/"
    }
  },
  
  {
    "title": "BitMind: Bitcoin Auto-Trading (Predictive Modeling)",
    "month": 3,
    "day": 9,
    "year": 2025,
    "description": "A trading system combining time-series prediction, backtesting, and real-time execution logic for decision-making.",
    "context": "Backtests fluctuated wildly until I introduced walk-forward validation and spot checks on the live feed, which kept the predictive signals from overfitting during demonstrations.",
    "language": "python",
    "category": "ai/ml",
    "icons": [
      "python",
      "pytorch",
      "tensorflow",
      "scikit"
    ],
    "note": "d",
    "keyBg": "assets/projects/bitmind/key.jpg",
    "media": {
      "big": "assets/projects/bitmind.png",
    },
    "links": {
      "github": "https://github.com/aundreka/bitmind",
    }
  },
   {
    "title": "UST Physics of Life and Stuff Research Group",
    "month": 1,
    "day": 21,
    "year": 2026,
    "description": "This website was developed for the Physics of Life and Stuff research group at the University of Santo Tomas. It serves as an online platform to present the group’s profile, research areas, projects, and related information in a clear and accessible format.",
    "context": "Coordinating researchers meant frequent copy updates, so I built a lightweight CMS using App Script that let the group maintain the research list without needing another deploy.",
    "language": "react",
    "category": "websites",
    "icons": [
      "react",
      "appscript",
      "javascript"
    ],
    "note": "g",
    "keyBg": "assets/projects/diversity-globe/key.jpg",
    "media": {
      "big": "assets/projects/pols.png",
    },
    "links": {
      "github": "https://github.com/aundreka/physicsoflifeandstuff",
      "live": "https://plsust.org/"
    }
  },
     {
    "title": "Universentiment: Sentiment Analysis on University Reviews",
    "month": 2,
    "day": 21,
    "year": 2026,
    "description": "Universentiment is a sentiment-analysis AI chatbot that lets prospective students ask about campus life across Philippine universities. ",
    "context": "Data bias surfaced early, so I blended manual annotations with crowd-sourced reviews and added a confidence indicator to explain why a reply leaned positive or negative.",
    "language": "react",
    "category": "websites",
    "icons": [
      "react",
      "appscript",
      "javascript"
    ],
    "note": "g",
    "keyBg": "assets/projects/diversity-globe/key.jpg",
    "media": {
      "big": "assets/projects/universentiment.png",
    },
    "links": {
      "github": "https://github.com/aundreka/universentiment",
      "docs": "https://drive.google.com/drive/folders/1yCvuD9kiI9rv-EldneBL64-HWXcc9vXR?usp=sharing/"
    }
  },
    {
    "title": "Hephzibah School",
    "month": 8,
    "day": 8,
    "year": 2024,
    "description": "A responsive single-page site for Hephzibah School (Secondary), a DepEd-recognized institution in Silang, Cavite. ",
    "context": "Limited brand assets meant guessing colors, so I built a quick style guide and got approval before committing to the layout.",
    "language": "php sql",
    "category": "websites",
    "icons": [
      "php",
      "mysql",
      "html"
    ],
    "note": "f",
    "keyBg": "assets/projects/school-websites/key.jpg",
    "media": {
      "big": "assets/projects/hephzibah.png",
    },
    "links": {
      "github": "https://github.com/aundreka/Hephzibah-School",
      "live": "https://aundreka.github.io/Hephzibah-School/"
    }
  },
      {
    "title": "Shalom Learning Center",
    "month": 8,
    "day": 8,
    "year": 2024,
    "description": "A responsive single-page site for Shalom Learning Center (Secondary), a DepEd-recognized institution in Dasmarinas, Cavite. ",
    "context": "Client feedback came in late so I modularized the sections, which let me swap layouts and texts without touching the underlying PHP again.",
    "language": "php sql",
    "category": "websites",
    "icons": [
      "php",
      "mysql",
      "html"
    ],
    "note": "f",
    "keyBg": "assets/projects/school-websites/key.jpg",
    "media": {
      "big": "assets/projects/shalom.png",
    },
    "links": {
      "github": "https://github.com/aundreka/Shalom-Learning-Center",
      "live": "https://aundreka.github.io/Shalom-Learning-Center/"
    }
  },
      {
    "title": "Makwills Integrated School",
    "month": 8,
    "day": 8,
    "year": 2024,
    "description": "A responsive single-page site for Makwills Integrated School (Secondary), a DepEd-recognized institution in Imus, Cavite. ",
    "context": "Network restrictions at the school made live edits hard, so I developed a scripted deployment that synced only changed sections and left the rest untouched.",
    "language": "php sql",
    "category": "websites",
    "icons": [
      "php",
      "mysql",
      "html"
    ],
    "note": "f",
    "keyBg": "assets/projects/school-websites/key.jpg",
    "media": {
      "big": "assets/projects/makwills.png",
    },
    "links": {
      "github": "https://github.com/aundreka/Makwills-Integrated-School",
      "live": "https://aundreka.github.io/Makwills-Integrated-School/"
    }
  },
      {
    "title": "Queen Anne School",
    "month": 8,
    "day": 8,
    "year": 2024,
    "description": "A responsive single-page site for Queen Anne School (Secondary), a DepEd-recognized institution in General Trias, Cavite. ",
    "context": "The school wanted a single-page feel while keeping SEO friendly, so I emulated landing scrolling but hosted each section as a separate PHP include for easier maintenance.",
    "language": "php sql",
    "category": "websites",
    "icons": [
      "php",
      "mysql",
      "html"
    ],
    "note": "f",
    "keyBg": "assets/projects/school-websites/key.jpg",
    "media": {
      "big": "assets/projects/queenanne.png",
    },
    "links": {
      "github": "https://github.com/aundreka/Queen-Anne-School",
      "live": "https://aundreka.github.io/Queen-Anne-School/"
    }
  },
      {
    "title": "SchEDU Learn",
    "month": 4,
    "day": 8,
    "year": 2026,
    "description": "schEDU learn is an intelligent study management app that automatically turns deadlines into personalized, adaptive study plans. At its core is a dynamic scheduling algorithm that continuously adjusts your study schedule in real time based on missed sessions, available time, and upcoming deadlines. By combining evidence-based learning strategies with smart automation and gamification, it helps students stay consistent, reduce burnout, and study more effectively.",
    "context": "We were only given 2 hours to develop this app for a hackathon, so we weren't able to implement all the features we wanted. We had to pick and choose and then perfect what we could.",
    "language": "react native",
    "category": "apps, ai/ml",
    "icons": [
      "react",
      "firebase",
      "expo"
    ],
    "note": "f",
    "keyBg": "assets/projects/school-websites/key.jpg",
    "media": {
      "big": "assets/projects/schedu-learn.png",
    },
    "links": {
      "github": "https://github.com/aundreka/schedu-learn",
      "docs": "https://drive.google.com/drive/folders/1EdtCSeuMFKG84rfW2L4kUYmfjrxVZlr7?usp=sharing"
    }
  },
];

window.PROJECTS_DATA.PROJECT_DATE_SEEDS = [
  "2026-02-12",
  "2026-01-26",
  "2025-12-10",
  "2025-11-18",
  "2025-10-09",
  "2025-09-15",
  "2025-08-22",
  "2025-07-12",
  "2025-06-06",
  "2025-05-21",
  "2025-04-14",
  "2025-03-01",
  "2025-01-19",
  "2024-12-06",
  "2024-11-10",
  "2024-10-04",
  "2024-09-17",
  "2024-08-08",
  "2024-07-21",
  "2024-06-11",
  "2024-05-03",
  "2024-04-18",
  "2024-03-09",
  "2024-02-22",
  "2024-01-12",
  "2023-11-18",
  "2023-10-07"
];
