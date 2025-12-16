<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sedang Pemeliharaan - SMEMSA</title>
    
    <script src="https://cdn.tailwindcss.com"></script>

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">

    <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>

    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 h-screen w-full flex items-center justify-center relative overflow-hidden">

    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

    <div class="relative bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 max-w-lg w-full text-center mx-4">
        
        <div class="flex justify-center -mt-10 mb-4">
            <dotlottie-player 
                src="https://lottie.host/8099e076-2f63-4422-990a-f0f4a274c439/s5qJ8Zqj9W.json" 
                background="transparent" 
                speed="1" 
                style="width: 250px; height: 250px;" 
                loop 
                autoplay>
            </dotlottie-player>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Sistem Sedang <span class="text-blue-600">Upgrade</span>
        </h1>
        
        <p class="text-slate-500 mb-8 leading-relaxed">
            Tim IT SMEMSA sedang melakukan perawatan rutin untuk meningkatkan performa & keamanan. Website akan segera kembali.
        </p>

        <div class="bg-slate-100 rounded-xl p-4 flex items-center justify-between border border-slate-200">
            <div class="flex items-center gap-3">
                <div class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </div>
                <span class="text-sm font-semibold text-slate-600">Status: Maintenance</span>
            </div>
            <span class="text-xs text-slate-400 font-mono">EST: 1 Jam</span>
        </div>

        <div class="mt-8">
            <button onclick="window.location.reload()" class="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-blue-600 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
                Coba Refresh Halaman
                <svg class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
        </div>

        <div class="mt-8 text-xs text-slate-400">
            &copy; {{ date('Y') }} Tim Developer SMEMSA
        </div>
    </div>

    <style>
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
    </style>
</body>
</html>