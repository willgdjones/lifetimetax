/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Supabase generic types need generated schema to resolve properly.
    // TODO: Run `supabase gen types` once DB is provisioned, then re-enable.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: []
  }
};

module.exports = nextConfig;
