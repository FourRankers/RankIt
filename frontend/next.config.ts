import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'test.jpg',        
      'localhost',      
      'firebasestorage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tirzchadpzbxjacbbcsw.supabase.co',
        // pathname: '/storage/v1/object/public/rankit-images/**',
      },
    ],
  },
};

export default nextConfig;
