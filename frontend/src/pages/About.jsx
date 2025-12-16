export default function About() {
    return (
        <section id="about" className="min-h-screen bg-white font-sans overflow-hidden relative">

            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full translate-y-48 -translate-x-48"></div>

            <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">

                <div className="flex flex-col lg:flex-row items-start gap-12 md:gap-20">
                    <div className="lg:w-1/2">

                        <h1 className="text-5xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                            Tentang <span className="text-indigo-600">kami</span>
                        </h1>

                        <div className="w-24 h-1 bg-indigo-500 rounded-full mb-12"></div>

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                            Kenapa Memilih Kami?
                        </h2>

                        <div className="text-gray-700 space-y-6 mb-10 max-w-2xl">
                            <p className="text-lg leading-relaxed">
                                Kami adalah tim siswa SMKS Muhammadiyah 1 Genteng yang fokus pada hasil nyata — menguasai frontend dan backend, serta mampu mengintegrasikan teknologi AI untuk mempercepat dan mempermudah proses pembuatan website. Kami mengutamakan komunikasi yang jelas, solusi yang mudah dipelihara, dan penyelesaian tepat waktu. Percayakan proyek Anda pada tim muda yang profesional, bertanggung jawab, dan hasil-orientasi.
                            </p>

                            <p className="text-lg leading-relaxed">
                                Dengan pengalaman dalam berbagai proyek, kami memahami kebutuhan bisnis modern dan siap membantu Anda mencapai tujuan digital Anda. Mari bekerja sama untuk menciptakan website yang tidak hanya menarik secara visual, tetapi juga fungsional dan efektif dalam mendukung pertumbuhan bisnis Anda.
                            </p>
                        </div>

                        <button className="group flex items-center space-x-3 text-indigo-600 hover:text-indigo-800 font-bold text-lg transition-colors">
                            <span className="border-b-2 border-indigo-600 group-hover:border-indigo-800 pb-1">
                                Lihat Portfolio
                            </span>
                            <span className="transform group-hover:translate-x-2 transition-transform">
                                →
                            </span>
                        </button>

                    </div>

                    <div className="lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-xl">

                            <div className="bg-gradient-to-br from-indigo-100 to-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                                <div className="aspect-[4/5] relative">

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center p-8">
                                            <div className="text-8xl mb-6">☕</div>
                                            <div className="text-3xl font-bold text-gray-800 mb-3">Third Place Café</div>
                                            <p className="text-gray-600">Where community brews</p>
                                        </div>
                                    </div>

                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                        <div className="text-2xl font-bold text-indigo-600">₺</div>
                                    </div>

                                    <div className="absolute bottom-6 right-6 bg-indigo-600 text-white rounded-xl p-4 shadow-lg">
                                        <div className="font-bold">Best of 2024</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-100 rounded-2xl -z-10"></div>
                            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-indigo-100 rounded-3xl -z-10"></div>

                            <div className="absolute -left-10 bottom-1/4 bg-white rounded-xl p-5 shadow-xl border border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🌟</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">4.9/5</div>
                                        <div className="text-sm text-gray-600">Community Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}