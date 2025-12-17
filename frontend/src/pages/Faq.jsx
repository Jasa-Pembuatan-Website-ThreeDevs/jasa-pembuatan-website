import React, { useState } from 'react';

const faqData = [
    {
        question: "Berapa lama waktu pengerjaan website?",
        answer: "Waktu pengerjaan tergantung pada kompleksitas proyek. Untuk website landing page sederhana, estimasi pengerjaan adalah 3-5 hari kerja. Untuk website company profile, estimasi pengerjaan adalah 7-10 hari kerja. Dan untuk website toko online, estimasi pengerjaan adalah 10-14 hari kerja."
    },
    {
        question: "Apakah website yang dibuat responsif?",
        answer: "Ya, semua website yang kami buat sudah responsif dan dapat menyesuaikan dengan berbagai ukuran layar, mulai dari smartphone, tablet, hingga desktop."
    },
    {
        question: "Apakah termasuk hosting dan domain?",
        answer: "Biaya hosting dan domain tidak termasuk dalam paket yang kami tawarkan. Anda perlu membeli hosting dan domain secara terpisah. Namun, kami dapat membantu Anda dalam memilih dan mengatur hosting serta domain yang sesuai."
    },
    {
        question: "Apakah ada garansi atau maintenance setelah website selesai?",
        answer: "Kami memberikan garansi perbaikan bug selama 1 bulan setelah website selesai. Untuk maintenance lebih lanjut, kami menawarkan paket maintenance bulanan dengan berbagai fitur seperti backup data, update keamanan, dan perbaikan bug."
    },
    {
        question: "Bisakah saya mengubah desain website setelah selesai?",
        answer: "Anda dapat melakukan perubahan desain selama proses pengerjaan. Namun, setelah website selesai dan diserahkan kepada Anda, perubahan desain akan dikenakan biaya tambahan tergantung pada kompleksitas perubahan yang diminta."
    },
    {
        question: "Apakah website yang dibuat SEO-friendly?",
        answer: "Ya, semua website yang kami buat sudah dioptimalkan untuk SEO dasar seperti struktur HTML yang baik, kecepatan loading, dan meta tag yang sesuai. Untuk optimasi SEO lebih lanjut, kami juga menawarkan layanan SEO khusus."
    },
    {
        question: "Metode pembayaran seperti apa yang Anda terima?",
        answer: "Kami menerima pembayaran melalui transfer bank dan dompet digital. Untuk proyek besar, kami menawarkan sistem pembayaran bertahap (DP 50% di awal, 30% saat progress 50%, dan 20% setelah selesai)."
    },
    {
        question: "Apakah saya akan mendapatkan pelatihan untuk mengelola website?",
        answer: "Ya, kami menyediakan pelatihan dasar pengelolaan website selama 1-2 jam secara gratis. Anda akan belajar cara mengupdate konten, menambah produk, dan mengelola fitur-fitur dasar website."
    }
];

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="min-h-screen bg-white font-sans overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full translate-y-48 -translate-x-48"></div>

            <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 text-center">
                        Pertanyaan yang <span className="text-indigo-600">Sering Diajukan</span>
                    </h1>

                    <div className="w-24 h-1 bg-indigo-500 rounded-full mb-12 mx-auto"></div>

                    <div className="space-y-4">
                        {faqData.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <button
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-indigo-50 transition-colors"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span className="text-lg font-semibold text-gray-800">
                                        {item.question}
                                    </span>
                                    <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </span>
                                </button>
                                <div className={`px-6 pb-4 transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <div className="pt-2 pb-4 text-gray-600 leading-relaxed">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-600 mb-6">
                            Masih memiliki pertanyaan? Jangan ragu untuk menghubungi kami!
                        </p>
                        <a href="/#contact" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-md">
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}