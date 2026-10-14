# Muhammad Faizan Rauf — Portfolio

Personal portfolio for a Senior Full Stack & AI/ML Engineer with DevOps experience. Built with Next.js 15, React 19, TypeScript, Tailwind CSS 4, and Motion.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Content

`data/portfolio.json` contains the profile, skills, work experience, projects, open-source tools, education, professional development, award, languages, and theme. Content is based on the supplied CV and owner-provided portfolio details. The downloadable CV is in `public/` at the path specified by `profile.resumeUrl`.

The AWS Cloud Practitioner exam is in progress. WebShield AI metrics describe offline temporal evaluation, not production accuracy. The recommendations section contains two supplied LinkedIn quotations and three explicitly labeled, unapproved testimonial drafts. Replace drafts with approved wording before treating them as received recommendations. npm packages remain hidden. GitHub cards use verified repository URLs and metadata, with six selected repositories.

The public website field is intentionally empty. Add the final URL to `profile.website` or set `SITE_URL` when the domain is ready. Until then, the app supports localhost previews, omits a public canonical URL, and disables search indexing and sitemap entries.

## Optional integrations

Copy `.env.example` to `.env.local` and configure the integrations you want:

- `OPENAI_API_KEY`: server-only key for the AI terminal. Built-in terminal commands work without it.
- `OPENAI_MODEL`: optional model override.
- `GITHUB_TOKEN`: optional server-only token for GraphQL contribution refreshes. Without a token, the app reads the public GitHub calendar. A dated, verified snapshot in `data/github-contributions.json` remains available when GitHub cannot be reached.
- `SITE_URL`: public deployment URL once available.

Do not prefix secret keys with `NEXT_PUBLIC_`.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
npx playwright install chromium
npm test
```

## Attribution

Adapted from Muddusar Zulfiqar's portfolio template. The original six educational blog articles retain their template attribution; four new AI/ML and automation articles credit Muhammad Faizan Rauf and cite primary documentation. The original MIT copyright notice is preserved in `LICENSE`.
