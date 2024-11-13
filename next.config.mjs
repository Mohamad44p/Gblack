/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["admin.g-black.com", "secure.gravatar.com"],
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
