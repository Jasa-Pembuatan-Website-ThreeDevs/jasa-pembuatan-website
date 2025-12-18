export default function About() {
    return (
        <section id="about" className="min-h-screen bg-white font-sans overflow-hidden relative">

            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full translate-y-48 -translate-x-48"></div>

            <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">

                <div className="flex flex-col lg:flex-row items-start gap-12 md:gap-20">
                    <div className="lg:w-1/2">

                        {/* Professional Badge */}
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full mb-8">
                            <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-semibold">Tim Profesional & Berpengalaman</span>
                            <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            Tentang <span className="text-indigo-600">kami</span>
                        </h1>

                        <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12"></div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
                            Kenapa Memilih Kami?
                        </h2>

                        <div className="text-gray-700 space-y-8 mb-10 max-w-2xl">
                            <p className="text-base sm:text-lg leading-relaxed">
                                Kami adalah tim profesional dari SMKS Muhammadiyah 1 Genteng yang fokus pada hasil nyata — menguasai frontend dan backend, serta mampu mengintegrasikan teknologi AI untuk mempercepat dan mempermudah proses pembuatan website. Kami mengutamakan komunikasi yang jelas, solusi yang mudah dipelihara, dan penyelesaian tepat waktu.
                            </p>

                            <p className="text-base sm:text-lg leading-relaxed">
                                Dengan pengalaman dalam berbagai proyek, kami memahami kebutuhan bisnis modern dan siap membantu Anda mencapai tujuan digital Anda. Mari bekerja sama untuk menciptakan website yang tidak hanya menarik secara visual, tetapi juga fungsional dan efektif dalam mendukung pertumbuhan bisnis Anda.
                            </p>

                            {/* Key Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="fa-solid fa-bolt text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Cepat & Efisien</h4>
                                        <p className="text-sm text-gray-600">Penyelesaian tepat waktu dengan teknologi terkini</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="fa-solid fa-shield-alt text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Berkualitas Tinggi</h4>
                                        <p className="text-sm text-gray-600">Standar profesional dan teruji</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="fa-solid fa-comments text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Komunikasi Lancar</h4>
                                        <p className="text-sm text-gray-600">Dukungan 24/7 dan respons cepat</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="fa-solid fa-robot text-sm"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Integrasi AI</h4>
                                        <p className="text-sm text-gray-600">Teknologi modern untuk hasil optimal</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <a href="#portfolio" className="group flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                <span className="flex items-center gap-2">
                                    <i className="fa-solid fa-portrait"></i>
                                    <span>Lihat Portfolio</span>
                                </span>
                                <span className="transform group-hover:translate-x-2 transition-transform">
                                    →
                                </span>
                            </a>
                            <a href="/order" className="flex items-center space-x-3 border-2 border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white font-bold py-3 px-6 rounded-full transition-all duration-300">
                                <span className="flex items-center gap-2">
                                    <i className="fa-solid fa-shopping-cart"></i>
                                    <span>Pesan Sekarang</span>
                                </span>
                            </a>
                        </div>

                    </div>

                    <div className="lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-xl">

                            <div className="bg-gradient-to-br from-indigo-100 to-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                                <div className="aspect-[4/5] relative">

                                    {/* Image background (working image) - keep overlays above this image */}
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
                                        alt="People working in a café"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    {/* Optional subtle dark overlay so badges/text remain readable */}
                                    <div className="absolute inset-0 bg-black/15" aria-hidden="true"></div>

                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                        <div className="text-2xl font-bold text-indigo-600">TD</div>
                                    </div>

                                    <div className="absolute bottom-6 right-6 bg-indigo-600 text-white rounded-xl p-4 shadow-lg">
                                        <div className="font-bold">Best of Business Website</div>
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