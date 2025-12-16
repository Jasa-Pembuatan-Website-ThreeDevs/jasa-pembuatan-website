const packages = [
  {
    name: "Paket Lite",
    badge: "Paling Populer",
    price: "Rp 299",
    desc: "Solusi ideal untuk bisnis kecil dan pemula yang ingin memulai dengan biaya terjangkau.",
    features: [
      "Website Responsif",
      "5 Halaman Website",
      "Hosting 1GB",
      "Support 24/7",
      "SSL Certificate",
    ],
    highlight: false,
  },
  {
    name: "Paket Pro",
    badge: "TERLARIS",
    price: "Rp 699",
    desc: "Solusi lengkap untuk bisnis menengah dengan fitur advanced dan performa optimal.",
    features: [
      "Semua fitur Paket Lite",
      "15 Halaman Website",
      "Hosting 5GB SSD",
      "Email Profesional",
      "Analytics Dashboard",
      "Integrasi E-commerce",
    ],
    highlight: true,
  },
  {
    name: "Paket Advance",
    badge: "",
    price: "Rp 1.499",
    desc: "Solusi premium untuk perusahaan besar dengan kebutuhan kompleks dan skalabilitas tinggi.",
    features: [
      "Semua fitur Paket Pro",
      "Unlimited Halaman",
      "Hosting 20GB SSD",
      "CDN Global",
      "Priority Support",
      "Custom Development",
      "Dedicated Account Manager",
    ],
    highlight: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Jasa <span className="text-indigo-600">Kami</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`rounded-2xl h-fit p-8 transition-all duration-300 transform hover:-translate-y-2
                ${
                  pkg.highlight
                    ? "border-2 border-indigo-500 shadow-2xl relative"
                    : "border border-gray-100 shadow-lg hover:shadow-xl"
                }`}
            >
              {pkg.badge && (
                <div
                  className={`inline-block px-4 py-1 mb-6 text-sm font-semibold rounded-full
                    ${
                      pkg.highlight
                        ? "absolute top-0 right-0 bg-indigo-600 text-white rounded-bl-lg"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                >
                  {pkg.badge}
                </div>
              )}

              <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
              <p className="text-gray-600 mb-8">{pkg.desc}</p>

              <div className="mb-8 flex items-baseline">
                <span className="text-4xl font-bold">{pkg.price}</span>
                <span className="text-gray-500 ml-2">.000 /bulan</span>
              </div>

              <ul className="space-y-4 mb-10">
                {pkg.features.map((f, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-indigo-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Pilih Paket
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
