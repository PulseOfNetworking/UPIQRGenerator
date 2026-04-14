# UPI QR Generator

A **production-ready, fully client-side** UPI QR code generator that supports both **Simple UPI deep-link** and **EMVCo-compliant QR codes** with CRC16-CCITT checksum verification.

> 🔒 Everything runs in your browser. No backend. No tracking. No data leaves your device.

---

## ✨ Features

- **Simple UPI QR** — standard `upi://pay` deep-link (works with GPay, PhonePe, Paytm, etc.)
- **EMVCo QR** — TLV-encoded, CRC16-CCITT verified, bank-grade compliant
- Live QR code preview
- Download QR as PNG
- Copy raw payload to clipboard
- Last 5 QRs saved in localStorage
- Dark / Light mode toggle
- Mobile responsive
- Zero backend — 100% client-side

---

## 🛠 Tech Stack

| Tool | Version |
|------|---------|
| React | 18.x |
| Vite | 5.x |
| Tailwind CSS | 3.x |
| qrcode (npm) | 1.5.x |
| gh-pages | 6.x |

---

## 📂 Project Structure

```
upi-qr-generator/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── InputForm.jsx      # Form with validation
│   │   ├── QRCard.jsx         # QR preview + download + copy
│   │   ├── HistoryPanel.jsx   # Last 5 QR history
│   │   └── ThemeToggle.jsx    # Dark/light toggle
│   ├── utils/
│   │   ├── emvco.js           # TLV encoder, CRC16, payload builders
│   │   └── storage.js         # localStorage history helpers
│   ├── App.jsx                # Root application shell
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind + global styles
├── index.html
├── vite.config.js             # base: '/upi-qr-generator/'
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173/upi-qr-generator/
```

---

## 🏗 Production Build

```bash
npm run build
```

Output goes to `dist/`. You can preview locally with:

```bash
npm run preview
# http://localhost:4173/upi-qr-generator/
```

---

## 🌐 Deploy to GitHub Pages

### Option A — Using `gh-pages` CLI (Recommended)

```bash
# 1. Install gh-pages (already in devDependencies)
npm install

# 2. Build + deploy in one step
npm run deploy
```

This runs `npm run build && npx gh-pages -d dist` which:
- Builds the project into `dist/`
- Pushes it to the `gh-pages` branch of your repo

Then:
1. Go to your repo → **Settings** → **Pages**
2. Set source: **Deploy from branch** → `gh-pages` → `/ (root)`
3. Your app will be live at: `https://<your-username>.github.io/upi-qr-generator/`

---

### Option B — GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

### Option C — Serve `dist/` manually

```bash
npm run build
# Upload contents of dist/ to any static host:
# Vercel, Netlify, Cloudflare Pages, S3, etc.
```

> ⚠️ If deploying to a **custom domain or root path**, change `base` in `vite.config.js`:
> ```js
> base: '/',  // for root-level deploy
> ```

---

## 🧮 EMVCo Implementation Details

### TLV Encoding

```
TAG (2 chars) + LENGTH (2 chars, zero-padded) + VALUE
e.g.: tlv('59', 'Rahul') → "5905Rahul"
```

### Payload Structure

| Tag | Field | Value |
|-----|-------|-------|
| 00 | Payload Format Indicator | `01` |
| 01 | Point of Initiation | `12` (dynamic) |
| 26 | Merchant Account Info | GUID + UPI VPA |
| 52 | Merchant Category Code | `0000` |
| 53 | Transaction Currency | `356` (INR) |
| 54 | Transaction Amount | e.g. `100.00` |
| 58 | Country Code | `IN` |
| 59 | Merchant Name | payee name |
| 60 | Merchant City | e.g. `Kolkata` |
| 63 | CRC | CRC16-CCITT (4 hex chars) |

### CRC16-CCITT

- Polynomial: `0x1021`
- Initial value: `0xFFFF`
- Calculated over entire string **including** `6304` tag+length
- Appended as 4 uppercase hex chars

---

## 📝 License

MIT — free to use, modify, and distribute.
