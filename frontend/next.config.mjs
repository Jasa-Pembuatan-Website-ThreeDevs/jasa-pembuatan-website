/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
  },
  // Optimasi build
  compiler: {
    // Hapus console.log di production untuk performa & keamanan
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
