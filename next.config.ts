import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  async redirects() {
    return [
      { source: '/M_Faizan_Rauf_Senior_Full_Stack_AI_ML_DevOps_CV.pdf', destination: '/M_Faizan_Rauf_SSE_AI_ML_Cloud_Engineer_CV.pdf', permanent: true },
      { source: '/Muhammad_Faizan_Rauf_Solution_Architect_CV.pdf', destination: '/M_Faizan_Rauf_SSE_AI_ML_Cloud_Engineer_CV.pdf', permanent: true },
      { source: '/blog/rag', destination: '/blog/how-rag-works', permanent: true },
      { source: '/blog/jwt', destination: '/blog/how-claude-skills-and-harnesses-work', permanent: true },
      { source: '/blog/how-jwt-works', destination: '/blog/how-claude-skills-and-harnesses-work', permanent: true },
      { source: '/blog/sessions', destination: '/blog/how-sessions-work', permanent: true },
      { source: '/blog/cicd', destination: '/blog/how-cicd-works', permanent: true },
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
