import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  metadataBase: new URL("https://threedevs.id"),
  title: {
    default: "ThreeDevs - Jasa Pembuatan Website Profesional",
    template: "%s - ThreeDevs",
  },
  description:
    "ThreeDevs adalah software house Banyuwangi untuk website bisnis, landing page, company profile, e-commerce, dan web app yang cepat, elegan, SEO-ready, dan mudah dirawat.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ThreeDevs - Jasa Pembuatan Website Profesional",
    description:
      "Bangun website bisnis yang cepat, elegan, SEO-ready, dan siap menjadi aset digital jangka panjang.",
    url: "/",
    siteName: "ThreeDevs",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
