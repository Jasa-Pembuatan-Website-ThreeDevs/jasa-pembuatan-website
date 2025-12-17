import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'website',
    budget: '5-10',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Data layanan yang ditawarkan
  const services = [
    { id: 'website', name: 'Website Perusahaan' },
    { id: 'ecommerce', name: 'E-Commerce' },
    { id: 'landing', name: 'Landing Page' },
    { id: 'custom', name: 'Web App Kustom' },
    { id: 'maintenance', name: 'Maintenance Website' }
  ];

  // Pilihan budget
  const budgetOptions = [
    { id: '3-5', label: 'Rp 3-5 juta' },
    { id: '5-10', label: 'Rp 5-10 juta' },
    { id: '10-20', label: 'Rp 10-20 juta' },
    { id: '20+', label: '> Rp 20 juta' },
    { id: 'not-sure', label: 'Belum pasti' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fungsi untuk mengirim pesan ke WhatsApp
  const sendToWhatsApp = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format pesan untuk WhatsApp
    const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp bisnis Anda
    const message = `Halo, saya ${formData.name}!

Saya tertarik dengan layanan pembuatan website untuk: *${formData.projectType}*
Dengan budget: *${budgetOptions.find(b => b.id === formData.budget)?.label}*

Detail proyek:
${formData.message}

Kontak saya:
Email: ${formData.email}
Telepon: ${formData.phone}

Mohon informasi lebih lanjut mengenai layanan Anda. Terima kasih!`;

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);
    
    // Redirect ke WhatsApp dengan pesan yang sudah diisi
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Simulasi pengiriman berhasil
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form setelah 3 detik
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: 'website',
          budget: '5-10',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Hubungi Kami untuk</span>
            <span className="block text-indigo-600">Layanan Website Anda</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Diskusikan kebutuhan website Anda dengan tim ahli kami. Kirim pesan langsung ke WhatsApp kami untuk konsultasi gratis.
          </p>
        </div>

        {/* Konten utama */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form kontak */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="mt-4 text-2xl font-medium text-gray-900">Pesan Terkirim!</h3>
                  <p className="mt-2 text-gray-500">
                    Terima kasih telah menghubungi kami. Tim kami akan segera merespons melalui WhatsApp.
                  </p>
                  <p className="mt-4 text-sm text-gray-500">
                    Anda akan diarahkan kembali ke halaman ini dalam beberapa detik...
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Isi Form Konsultasi</h2>
                  <form onSubmit={sendToWhatsApp} className="space-y-6">
                    {/* Nama dan Email */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                          placeholder="Nama Anda"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                          placeholder="email@contoh.com"
                        />
                      </div>
                    </div>

                    {/* Telepon dan Tipe Proyek */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                          placeholder="0812 3456 7890"
                        />
                      </div>
                      <div>
                        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Layanan *
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        >
                          {services.map(service => (
                            <option key={service.id} value={service.id}>{service.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Perkiraan Budget *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {budgetOptions.map(option => (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="radio"
                              id={option.id}
                              name="budget"
                              value={option.id}
                              checked={formData.budget === option.id}
                              onChange={handleChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor={option.id} className="ml-2 block text-sm text-gray-700">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pesan */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Detail Kebutuhan Website Anda *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Jelaskan secara singkat tentang kebutuhan website Anda..."
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <svg className="mr-3 h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.703 3.543 1.079 5.491 1.079 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.723 4.282 1.946 5.945l.201-.13 4.244 2.475.137.085-1.128 4.118zm8.344-5.653l-7.216 4.215 2.578-9.414 7.216-4.215-2.578 9.414zm2.259-1.833l1.541-5.624-5.621 1.54 4.08 4.084z"/>
                            </svg>
                            Kirim via WhatsApp Sekarang
                          </>
                        )}
                      </button>
                      <p className="mt-3 text-sm text-gray-500 text-center">
                        Dengan mengklik tombol di atas, Anda akan diarahkan ke WhatsApp untuk mengirim pesan langsung ke tim kami.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Informasi kontak dan layanan */}
          <div className="lg:w-1/3">
            {/* Kartu kontak langsung */}
            <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hubungi Kami Langsung</h3>
              <p className="text-gray-600 mb-6">
                Butuh konsultasi cepat? Hubungi kami langsung melalui WhatsApp tanpa mengisi form.
              </p>
              
              <a 
                href="https://wa.me/62895368757054?text=Halo,%20saya%20ingin%20konsultasi%20tentang%20pembuatan%20website" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200 mb-4"
              >
                <svg className="mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.703 3.543 1.079 5.491 1.079 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.723 4.282 1.946 5.945l.201-.13 4.244 2.475.137.085-1.128 4.118z"/>
                </svg>
                Chat via WhatsApp
              </a>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Telepon/WhatsApp</p>
                    <p className="text-sm text-gray-600">+62 895368757054</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">info@threedevs.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Kantor</p>
                    <p className="text-sm text-gray-600">Jl. Teknologi No. 123, Jakarta Selatan, Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Kartu layanan */}
            <div className="bg-indigo-700 text-white shadow-xl rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Layanan Kami</h3>
              <ul className="space-y-3">
                {services.map(service => (
                  <li key={service.id} className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-indigo-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>{service.name}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-indigo-600">
                <p className="text-indigo-200">
                  <span className="font-bold">Garansi 100%</span> - Website sesuai permintaan atau uang kembali
                </p>
                <p className="text-indigo-200 mt-1">
                  <span className="font-bold">Gratis Konsultasi</span> - Diskusi kebutuhan tanpa biaya
                </p>
                <p className="text-indigo-200 mt-1">
                  <span className="font-bold">Support 24/7</span> - Tim kami siap membantu kapan saja
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Pertanyaan Umum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Berapa lama waktu pengerjaan website?</h4>
              <p className="text-gray-600">Waktu pengerjaan bervariasi tergantung kompleksitas proyek. Rata-rata 2-4 minggu untuk website perusahaan, dan 4-8 minggu untuk e-commerce.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Apakah harga sudah termasuk domain dan hosting?</h4>
              <p className="text-gray-600">Ya, paket lengkap kami sudah mencakup domain (.id atau .com), hosting premium, SSL certificate, dan maintenance selama 1 tahun.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Bisakah saya request revisi desain?</h4>
              <p className="text-gray-600">Tentu! Kami memberikan unlimited revisi pada tahap desain hingga Anda puas dengan hasilnya sebelum masuk ke tahap development.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Bagaimana proses pembayarannya?</h4>
              <p className="text-gray-600">Pembayaran dilakukan secara bertahap: 50% di awal, 30% setelah desain disetujui, dan 20% setelah website live.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;