/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lightpink-oryx-206000.hostingersite.com", "secure.gravatar.com"],
  },
  async headers() {
    return [
      {
        source: "/api/auth/verify",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
