import React from 'react';

const steps = [
  {
    id: 1,
    title: "Konsultasi",
    desc: "Diskusi santai via WA/Zoom. Ceritakan ide liarmu, kami dengarkan.",
    icon: "💬", // Bisa ganti pakai Icon library kayak Lucide-react/Heroicons
  },
  {
    id: 2,
    title: "Deal & DP",
    desc: "Sepakati harga & fitur. Bayar DP 50% untuk tanda jadi.",
    icon: "🤝",
  },
  {
    id: 3,
    title: "Pengerjaan",
    desc: "Kami 'bertapa' coding website impianmu. Kamu tinggal duduk manis.",
    icon: "💻",
  },
  {
    id: 4,
    title: "Revisi",
    desc: "Cek hasilnya. Kurang sreg warna atau font? Kami perbaiki (Max 3x).",
    icon: "✨",
  },
  {
    id: 5,
    title: "Serah Terima",
    desc: "Web lunas, kami kasih akses penuh & tutorial cara pakainya.",
    icon: "🚀",
  },
];

const WorkProcess = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Judul Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja Kami
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Tidak perlu ribet. Kami buat proses pembuatan website jadi simpel dan transparan.
          </p>
        </div>

        {/* Grid Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          
          {/* Garis Penghubung (Hanya muncul di Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 -z-10"></div>

          {steps.map((step, index) => (
            <div key={step.id} className="relative flex flex-col items-center text-center group">
              
              {/* Lingkaran Icon */}
              <div className="w-24 h-24 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center text-4xl shadow-sm mb-6 group-hover:border-blue-500 group-hover:scale-110 transition-all duration-300 relative z-10">
                {step.icon}
                {/* Badge Nomor Kecil */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-white">
                  {step.id}
                </div>
              </div>

              {/* Teks */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-2">
                {step.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default WorkProcess;