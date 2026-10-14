# Muhammad Faizan Rauf – Senior Software and AI/ML Engineer Portfolio

Professional portfolio for a **Senior Software and AI/ML Engineer | Solution Architect | Cloud Systems**, with **7+ years of experience** covering distributed systems, enterprise RAG, multi-agent automation, and AWS delivery across FinTech, healthcare, e-commerce, and IoT.

Minimal, responsive portfolio built with **Next.js 15**, **Tailwind CSS 4**, and **Motion**.

Profile content is managed through **JSON**, with an optional **OpenAI-powered terminal**.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[View Live Portfolio](https://resume-m-faizan-rauf.vercel.app/)**

## ✨ Features

- **Next.js App Router** – Dedicated pages for experience, skills, projects, writing, and the playground.
- **Fully Responsive** – Layouts for desktop, tablet, and mobile.
- **Smooth Animations** – Page entrances and interactive effects powered by Motion.
- **Theme Customization** – Five color palettes, three font styles, and theme-aware profile JSON.
- **JSON-Based Profile** – Update skills, experience, projects, metrics, and recommendations in one file.
- **GitHub Activity** – Selected repositories and a contribution calendar with a snapshot fallback.
- **Technical Writing & Playground** – Thirteen articles for solution architects covering cloud reliability, AI/ML, agents, automation, and backend engineering, plus interactive demos.
- **Optional AI Terminal** – OpenAI-powered profile answers, with built-in commands available without an API key.

## 🚀 Quick Start

Use **Node.js 20 or later** and **npm**.

### 1. Clone the Repository

```bash
git clone https://github.com/faizanrauf6/modern-portfolio.git
cd modern-portfolio
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Configure Environment (Optional for AI Features)

Copy the environment template:

```bash
cp .env.example .env.local
```

To enable AI answers, add your OpenAI API key to `.env.local`:

```dotenv
OPENAI_API_KEY="your_openai_api_key"
OPENAI_MODEL="gpt-6-luna"
```

Keep the key server-side; do not prefix it with `NEXT_PUBLIC_`. The portfolio runs without API credentials, and `.env.local` is excluded from Git and deployment uploads.

Paste the real key only into your local `.env.local`, then restart `npm run dev`. Keep `.env.example` as an empty template. For the live site, configure `OPENAI_API_KEY` separately in Vercel's production environment and redeploy; local credentials are not uploaded.

The terminal defaults to GPT-6 Luna with reasoning disabled. To keep usage small, requests use a compact factual profile, at most four chat messages, and a 200-token reply limit. Questions are limited to 600 characters; recommendation quotes are included only when relevant. Built-in commands such as `skills`, `projects`, and `contact` make no API requests. Set `OPENAI_MODEL` to override the default.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Customize Your Portfolio

Edit `data/portfolio.json` to update the profile, skills, experience, projects, metrics, recommendations, and default theme. Blog content lives in `app/blog/` and `components/blog/posts/`; the downloadable résumé lives in `public/`.

The current résumé is `public/M_Faizan_Rauf_SSE_AI_ML_Cloud_Engineer_CV.pdf`. Both previous résumé URLs redirect to this updated document.

## ☁️ Deploy to Vercel

The project uses Vercel's **Next.js preset** with the repository root as its project directory. Deployments are currently manual:

```bash
npx vercel login
npx vercel link --project modern-portfolio --scope faizanrauf6s-projects --yes
npx vercel deploy --prod --scope faizanrauf6s-projects
```

Set `SITE_URL` to `https://resume-m-faizan-rauf.vercel.app` in Vercel's production environment. Add `OPENAI_API_KEY` there to enable live AI answers. `GITHUB_TOKEN` is optional for authenticated GitHub contribution requests.

GitHub pushes update the repository; run a manual deployment to publish those changes to the live site.

## ✅ Quality Checks

```bash
npm run lint
npm run build
npx playwright install chromium
npm test
```

GitHub Actions runs lint, the production build, and tests on pushes to `main` and on pull requests.

## 📄 License

[MIT License](LICENSE).

---

Built with ❤️ by **Muhammad Faizan Rauf**

[GitHub](https://github.com/faizanrauf6) · [LinkedIn](https://www.linkedin.com/in/m-faizan-rauf) · [Email](mailto:faizanrauf6@gmail.com)
