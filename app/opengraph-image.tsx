import { ImageResponse } from 'next/og';
import portfolioData from '@/data/portfolio.json';

export const alt = `${portfolioData.profile.name} — ${portfolioData.profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const { profile, theme } = portfolioData;
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('');
  const domain = profile.website
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: theme.background,
          color: theme.text,
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: theme.accent,
          }}
        >
          <span>{initials} / 2026</span>
          <span>{domain}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            {profile.name.split(' ')[0]}
            &nbsp;
            <span style={{ color: theme.accent }}>{profile.name.split(' ').slice(1).join(' ')}</span>
          </div>
          <div
            style={{
              display: 'flex',
              height: 8,
              width: 240,
              background: theme.highlight,
              marginTop: 28,
            }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 30, marginTop: 34 }}>
            {profile.title} · {profile.yearsOfExp} years
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 22 }}>
          {profile.stack.slice(0, 5).map((s) => (
            <span
              key={s}
              style={{
                display: 'flex',
                border: `1px solid ${theme.accent}`,
                borderRadius: 999,
                padding: '8px 22px',
                color: theme.accent,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
