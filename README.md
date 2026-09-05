# Playify — Next-Gen Music Streaming PWA & Android Application

[![Live Web App](https://img.shields.io/badge/Live_App-Cloudflare_Edge-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://peaceful-davinci.cotton-vole.workers.dev)
[![Download APK](https://img.shields.io/badge/Download_APK-v64.0_Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://peaceful-davinci.cotton-vole.workers.dev/Playify.apk)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_Service_Worker-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Playify** is a high-performance web and mobile audio streaming platform designed for instantaneous playback, offline caching, and cross-platform accessibility. It features a standalone Progressive Web App (PWA), a native Android APK build (v64.0), and an edge-deployed serverless Cloudflare Workers backend implementing cryptographic media stream decryption.

---

## 📐 System Topology & Data Flow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                            │
│     (Android App v64.0 / Mobile PWA / Desktop Web Audio Player)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Client Runtime & Caching                          │
│                                                                        │
│   ┌────────────────────┐ ┌────────────────────┐ ┌───────────────────┐  │
│   │ Audio Engine (JS)  │ │ Service Worker (SW)│ │ IndexedDB / Cache │  │
│   │ (Queue & Buffering)│ │ (Offline Caching)  │ │ (Local Playlists) │  │
│   └─────────┬──────────┘ └─────────┬──────────┘ └─────────┬─────────┘  │
└─────────────┼──────────────────────┼──────────────────────┼────────────┘
              │                      │                      │
              └──────────────────────┼──────────────────────┘
                                     │
                        Edge Fetch / Reverse Proxy
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Cloudflare Workers Edge Serverless                     │
│               (peaceful-davinci.cotton-vole.workers.dev)               │
│                                                                        │
│   ┌──────────────────────────────────┐ ┌───────────────────────────┐   │
│   │   Pure DES Stream Decryption     │ │ CORS & Cache Headers Proxy│   │
│   │   (Crypto Subkey Generation)     │ │ (Sub-50ms Edge Response)  │   │
│   └──────────────────────────────────┘ └───────────────────────────┘   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Decrypted Audio Stream Buffer                     │
│                        (Continuous Playback)                           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Key Engineering Highlights

- **Edge Cryptographic Decryption:** Implements a pure JavaScript DES decryption engine inside Cloudflare Workers (`_worker.js`) to dynamically resolve and stream media packets without external dependencies.
- **Offline PWA Engine:** Custom Service Worker (`sw.js`) intercepts media assets, top charts, and metadata for seamless offline playback and background audio support.
- **Native Android Packaging:** Shipped as a standalone Android APK (`Playify.apk`, v64.0) with custom app manifest, adaptive icons, and hardware audio controls integration.
- **Dynamic Chart & Discovery Engine:** Client-side playlist management, artist search, trending chart categorization (`charts_data.js`), and instant responsive playback controls.
- **Cross-Platform Entertainment Companion:** Bundles responsive micro-apps for sports updates and entertainment trailers (`cricket.html`, `movies.html`).

---

## 🛠️ Tech Stack

- **Client Runtime:** Vanilla JavaScript (ES6+), HTML5 Audio API, Service Worker API (PWA)
- **Styling:** Custom responsive dark-mode UI with fluid touch gestures
- **Mobile Distribution:** Android APK (v64.0 standalone build)
- **Edge Infrastructure:** Cloudflare Workers Serverless API
- **Cryptography:** Pure DES (Data Encryption Standard) stream decryptor

---

## 🚀 Live Access & Deployment

- **Live Production App:** [https://peaceful-davinci.cotton-vole.workers.dev](https://peaceful-davinci.cotton-vole.workers.dev)
- **Direct APK Download:** [https://peaceful-davinci.cotton-vole.workers.dev/Playify.apk](https://peaceful-davinci.cotton-vole.workers.dev/Playify.apk)
- **Localhost Development:** `http://localhost/guru4code/demos/playify/index.html` (via XAMPP)

---

## 👤 Author & Architecture

Architected and developed by **Gursharan Singh** ([@gurumaan](https://github.com/gurumaan)).

- Email: [gurudeveloper05@gmail.com](mailto:gurudeveloper05@gmail.com)
- Portfolio: [https://github.com/gurumaan/portfolio](https://github.com/gurumaan/portfolio)
