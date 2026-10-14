# Muhammad Faizan Rauf — Portfolio

Personal portfolio showcasing full-stack engineering, AI/ML, automation, and DevOps experience across commercial products and open-source projects.

Built with Next.js, React, TypeScript, Tailwind CSS, and Motion.

## Features

- Professional profile, experience timeline, education, and recommendations.
- Project case studies with technology stacks, contributions, and website or repository links.
- Selected GitHub repositories and a contribution calendar with daily refreshes and a snapshot fallback.
- Technical articles on AI agents, Claude skills, machine learning, backend systems, and delivery workflows.
- Interactive playground for responsive layouts, themes, animations, accessibility, and performance.
- Optional AI terminal for questions about the portfolio, with built-in commands available offline.
- Responsive navigation, keyboard command palette, and customizable colors and typography.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 15 App Router, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, CSS custom properties |
| Animation and icons | Motion, Lucide React |
| Integrations | OpenAI SDK, GitHub GraphQL and public contribution calendar |
| Analytics | Vercel Analytics, Speed Insights |
| Quality checks | ESLint, TypeScript, Playwright, GitHub Actions |

## Getting Started

Use Node.js 20 or later and npm.

```bash
git clone https://github.com/faizanrauf6/modern-portfolio.git
cd modern-portfolio
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Configuration

Copy the environment template to configure optional integrations:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public portfolio URL used for canonical links, structured data, and the sitemap. |
| `OPENAI_API_KEY` | Server-side key that enables AI-generated terminal answers. |
| `OPENAI_MODEL` | Optional model override for the AI terminal. |
| `GITHUB_TOKEN` | Optional server-side token for GitHub GraphQL contribution requests. |

The portfolio runs without API credentials. The GitHub calendar uses public data when no token is configured and retains a dated snapshot if GitHub is unavailable. The terminal's built-in commands work independently of AI access.

Set `SITE_URL` or `profile.website` in `data/portfolio.json` when the public domain is available. Without a public URL, search indexing and sitemap entries remain disabled. Keep API credentials server-side; `.env.local` is excluded from version control.

## Content and Customization

Most portfolio content is managed in `data/portfolio.json`.

| Content | Location |
| --- | --- |
| Profile, skills, experience, projects, recommendations, and credentials | `data/portfolio.json` |
| About and homepage metrics | `profile.stats` and `profile.impactStats` in `data/portfolio.json` |
| Default color palette | `theme` in `data/portfolio.json` |
| GitHub contribution fallback | `data/github-contributions.json` |
| Downloadable résumé | `public/`, referenced by `profile.resumeUrl` |
| Blog articles and metadata | `app/blog/` and `components/blog/posts/` |
| Shared interface components | `components/` |

## Project Structure

```text
app/             Pages, route handlers, metadata, and global styles
components/      Portfolio sections, shared UI, blog content, and playground demos
data/            Portfolio content and contribution snapshot
hooks/           Shared React hooks
lib/             Utilities, contribution parsing, and SEO helpers
public/          Public assets and downloadable résumé
tests/           Browser smoke tests and calendar regression tests
.github/         Continuous integration workflow
```

## Development and Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
npx playwright install chromium
npm test
```

Playwright starts a development server or reuses one running on port 3000. GitHub Actions runs linting, the production build, and tests on pushes to `main` and on pull requests.

The production build is configured to generate Next.js standalone output. Configure the deployment environment, including the public URL, before building for production.

## Contact

[GitHub](https://github.com/faizanrauf6) · [LinkedIn](https://www.linkedin.com/in/m-faizan-rauf) · [Email](mailto:faizanrauf6@gmail.com)

## License

[MIT](LICENSE).
