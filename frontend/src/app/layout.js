import "./globals.css";

export const metadata = {
  title: "ThreeDevs — Wujudkan Website Impian Anda",
  description:
    "ThreeDevs adalah IT Agency yang menghadirkan website modern, performa tinggi, dan desain elegan untuk bisnis Anda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
