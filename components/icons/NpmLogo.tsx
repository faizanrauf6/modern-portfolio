// Official npm logomarks (npm, Inc. brand assets).

/** The square npm logo — red background, bracket "n" mark. Used as the app/favicon-style icon. */
export function NpmSquareLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 2500 2500" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fill="#c00" d="M0 0h2500v2500H0z" />
      <path fill="#fff" d="M1241.5 268.5h-973v1962.9h972.9V763.5h495v1467.9h495V268.5z" />
    </svg>
  );
}

/** The pixel-lettered npm wordmark — reads "npm" at small sizes, used inline next to package names. */
export function NpmWordLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
      <path
        fill="#cb3837"
        d="M2 38.5h124v43.71H64v7.29H36.44v-7.29H2Zm6.89 36.43h13.78V53.07h6.89v21.86h6.89V45.79H8.89Zm34.44-29.14v36.42h13.78v-7.28h13.78V45.79Zm13.78 7.29H64v14.56h-6.89Zm20.67-7.29v29.14h13.78V53.07h6.89v21.86h6.89V53.07h6.89v21.86h6.89V45.79Z"
      />
    </svg>
  );
}
