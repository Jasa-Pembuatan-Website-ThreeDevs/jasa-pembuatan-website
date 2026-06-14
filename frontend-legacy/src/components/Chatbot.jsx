import React, { useState, useRef, useEffect } from 'react';

// ThreeDevs service data
const THREE_DEVS_DATA = {
  company: {
    name: "ThreeDevs",
    description: "Jasa pembuatan website profesional dengan tim siswa SMKS Muhammadiyah 1 Genteng yang fokus pada hasil nyata — menguasai frontend dan backend, serta mampu mengintegrasikan teknologi AI untuk mempercepat dan mempermudah proses pembuatan website.",
    tagline: "Transformasikan ide Anda menjadi website profesional yang menarik pengunjung dan meningkatkan penjualan.",
    features: [
      "Desain responsif",
      "SEO-ready",
      "Dukungan cepat 24/7",
      "Integrasi AI",
      "Hosting berkualitas",
      "SSL Certificate"
    ]
  },
  packages: [
    {
      name: "Paket Tiny",
      price: "Rp 299.000",
      features: [
        "Website Responsif",
        "5 Halaman Website",
        "Hosting 1GB",
        "Support 24/7",
        "SSL Certificate",
        "Revisi Desain 2 Kali"
      ],
      description: "Solusi ideal untuk bisnis kecil dan pemula yang ingin memulai dengan biaya terjangkau."
    },
    {
      name: "Paket Medium",
      price: "Rp 699.000",
      features: [
        "Semua fitur Paket Lite",
        "15 Halaman Website",
        "Hosting 5GB SSD",
        "Email Profesional",
        "Analytics Dashboard",
        "Integrasi E-commerce",
        "Revisi Desain 2 Kali"
      ],
      description: "Solusi lengkap untuk bisnis menengah dengan fitur advanced dan performa optimal."
    },
    {
      name: "Paket Pro+",
      price: "Rp 1.499.000",
      features: [
        "Semua fitur Paket Pro",
        "Unlimited Halaman",
        "Hosting 20GB SSD",
        "CDN Global",
        "Priority Support",
        "Custom Development",
        "Dedicated Account Manager",
        "Revisi Desain 2 Kali"
      ],
      description: "Solusi premium untuk perusahaan besar dengan kebutuhan kompleks dan skalabilitas tinggi."
    }
  ],
  contact: {
    orderLink: "/order",
    support: "24/7",
    email: "support@threedeves.com",
    phone: "+62-812-3456-7890"
  }
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Halo! Saya asisten AI ThreeDevs. Saya bisa membantu Anda dengan informasi tentang layanan pembuatan website kami. Ada yang bisa saya bantu?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        const userMessage = inputValue.trim();
        if (!userMessage) return;

        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            // Check for ThreeDevs-related queries first
            const botResponse = await handleThreeDevsQuery(userMessage, newMessages);
            if (botResponse) {
                setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
                return;
            }

            // If not a ThreeDevs query, use OpenRouter API
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Jasa Pembuatan Website'
                },
                body: JSON.stringify({
                    model: 'nex-agi/deepseek-v3.1-nex-n1:free',
                    messages: newMessages,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices.length > 0) {
                const botMessage = data.choices[0].message.content;
                setMessages(prev => [...prev, { role: 'assistant', content: botMessage }]);
            } else {
                throw new Error('No response from AI');
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.' 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Function to handle ThreeDevs-specific queries
    const handleThreeDevsQuery = async (userMessage, messages) => {
        const msg = userMessage.toLowerCase();
        
        // Check for ThreeDevs-related keywords
        const threeDevsKeywords = [
            'threede', 'jasa', 'website', 'paket', 'harga', 'layanan', 'pembuatan', 
            'web', 'desain', 'development', 'bisnis', 'perusahaan', 'order', 'pesan'
        ];
        
        const hasThreeDevsKeyword = threeDevsKeywords.some(keyword => msg.includes(keyword));
        
        if (!hasThreeDevsKeyword) {
            return null; // Not a ThreeDevs query
        }

        // Generate response based on query type
        if (msg.includes('paket') || msg.includes('harga') || msg.includes('price')) {
            return generatePackageResponse();
        }
        
        if (msg.includes('layanan') || msg.includes('jasa') || msg.includes('service')) {
            return generateServiceResponse();
        }
        
        if (msg.includes('order') || msg.includes('pesan') || msg.includes('beli')) {
            return generateOrderResponse();
        }
        
        if (msg.includes('kontak') || msg.includes('hubungi') || msg.includes('contact')) {
            return generateContactResponse();
        }
        
        if (msg.includes('perusahaan') || msg.includes('company') || msg.includes('tentang')) {
            return generateAboutResponse();
        }
        
        // Default ThreeDevs response
        return generateDefaultResponse();
    };

    // Generate package information response
    const generatePackageResponse = () => {
        const packages = THREE_DEVS_DATA.packages;
        let response = "Berikut adalah paket layanan pembuatan website ThreeDevs:\n\n";
        
        packages.forEach((pkg, index) => {
            response += `${index + 1}. **${pkg.name}** - ${pkg.price}\n`;
            response += `   ${pkg.description}\n`;
            response += `   Fitur:\n`;
            pkg.features.forEach(feature => {
                response += `   • ${feature}\n`;
            });
            response += "\n";
        });
        
        response += "Untuk pemesanan, silakan kunjungi halaman Order atau klik tombol 'Pilih Paket' di halaman Services.";
        return response;
    };

    // Generate service information response
    const generateServiceResponse = () => {
        const company = THREE_DEVS_DATA.company;
        let response = `**Tentang Layanan ThreeDevs**\n\n`;
        response += `${company.description}\n\n`;
        response += `**Keunggulan kami:**\n`;
        company.features.forEach(feature => {
            response += `• ${feature}\n`;
        });
        response += `\nKami menyediakan 3 paket layanan: Paket Tiny (Rp 299.000), Paket Medium (Rp 699.000), dan Paket Pro+ (Rp 1.499.000).`;
        return response;
    };

    // Generate order information response
    const generateOrderResponse = () => {
        const contact = THREE_DEVS_DATA.contact;
        let response = `**Cara Pemesanan**\n\n`;
        response += `Untuk memesan layanan pembuatan website ThreeDevs, Anda dapat:\n\n`;
        response += `1. Mengunjungi halaman Order di website kami\n`;
        response += `2. Menghubungi kami melalui:\n`;
        response += `   • Email: ${contact.email}\n`;
        response += `   • Phone: ${contact.phone}\n`;
        response += `   • Support: ${contact.support}\n\n`;
        response += `Tim kami akan segera merespon dan membantu Anda memilih paket yang sesuai.`;
        return response;
    };

    // Generate contact information response
    const generateContactResponse = () => {
        const contact = THREE_DEVS_DATA.contact;
        let response = `**Kontak ThreeDevs**\n\n`;
        response += `• Email: ${contact.email}\n`;
        response += `• Phone: ${contact.phone}\n`;
        response += `• Support: ${contact.support}\n`;
        response += `• Order: ${contact.orderLink}\n\n`;
        response += `Atau kunjungi halaman Order untuk memesan layanan secara langsung.`;
        return response;
    };

    // Generate about company response
    const generateAboutResponse = () => {
        const company = THREE_DEVS_DATA.company;
        let response = `**Tentang ThreeDevs**\n\n`;
        response += `${company.description}\n\n`;
        response += `**${company.tagline}**\n\n`;
        response += `Kami adalah tim profesional yang berdedikasi untuk membantu bisnis Anda tumbuh melalui solusi website yang modern dan efektif.`;
        return response;
    };

    // Generate default response for ThreeDevs queries
    const generateDefaultResponse = () => {
        let response = `Saya bisa membantu Anda dengan informasi tentang layanan pembuatan website ThreeDevs.\n\n`;
        response += `Silakan tanyakan tentang:\n`;
        response += `• Paket layanan dan harga\n`;
        response += `• Fitur dan layanan kami\n`;
        response += `• Cara pemesanan\n`;
        response += `• Kontak dan support\n\n`;
        response += `Atau kunjungi halaman Services untuk melihat detail paket kami.`;
        return response;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            { role: 'assistant', content: 'Halo! Saya asisten ThreeXDevs. Apa Yang Ingin Kamu Ketahui Tentang Jasa Pembuatan Website ThreeDevs?' }
        ]);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    aria-label="Open chat"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 left-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[70vh] sm:max-h-96 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Asisten ThreeXDevs</h3>
                                <p className="text-xs text-white/80">Siap membantu Anda</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={clearChat}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                title="Bersihkan chat"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                title="Tutup"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                        message.role === 'user'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-2xl">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 p-3">
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ketik pesan Anda..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                disabled={isTyping}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputValue.trim() || isTyping}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">Gunakan Shift + Enter untuk baris baru</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;