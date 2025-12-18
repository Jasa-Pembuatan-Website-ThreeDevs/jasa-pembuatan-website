// import React, { useState, useEffect } from 'react'
// import './App.css'
// import Navbar from './components/Navbar'
// import Footer from './components/Footer'
// import Home from './pages/Home'
// import About from './pages/About'
// import Services from './pages/Services'
// import Portfolio from './pages/Portfolio'
// import { Routes, Route } from "react-router-dom";
// import axios from 'axios';
// import MaintenancePage from "./components/MaintenancePage"; // <--- IMPORT DISINI
// import OrderPage from './pages/Order'
// import NotFound from './pages/NotFound'

// function App() {
//  const [isMaintenance, setIsMaintenance] = useState(false);
//   const [isLoadingCheck, setIsLoadingCheck] = useState(true);

//   useEffect(() => {
//     // ... logika cek server sama seperti sebelumnya ...
//     const checkServerStatus = async () => {
//       try {
//         await axios.get('http://localhost:8000/api/status');
//         setIsMaintenance(false);
//       } catch (error) {
//         if (error.response && error.response.status === 503) {
//           setIsMaintenance(true);
//         } else if (error.code === "ERR_NETWORK") {
//            // Kalau server mati total, tampilkan maintenance juga
//            setIsMaintenance(true);
//         }
//       } finally {
//         setIsLoadingCheck(false);
//       }
//     };
//     checkServerStatus();
//   }, []);

//   if (isLoadingCheck) {
//     return <div className="h-screen flex justify-center items-center">Loading...</div>; // Atau spinner
//   }

//   // === INI YANG DIUBAH ===
//   // Kalau maintenance, panggil komponen MaintenancePage
//   if (isMaintenance) {
//     return <MaintenancePage />;
//   }

//   // === 2. TAMPILAN JIKA MAINTENANCE ===
//   if (isMaintenance) {
//     return (
//       <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
//         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg border-b-4 border-red-500">
//           <h1 className="text-3xl font-bold text-red-600 mb-2">Sistem Sedang Perbaikan</h1>
//           <p className="text-gray-600">
//             Website sedang dalam pemeliharaan rutin oleh Tim Developer. 
//             Silakan kembali lagi nanti.
//           </p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Coba Refresh
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <>
//     <Routes>
//         <Route path="/order" element={<OrderPage />} />
//       </Routes>
//       <Navbar />
//       <Home />
//       <About />
//       <Services />
//       <Portfolio />
//       <Footer />
      
//     </>
//   )
// }

// export default App


import React, { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MaintenancePage from "./components/MaintenancePage";

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import OrderPage from './pages/Order'
import NotFound from './pages/NotFound'

function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get('http://localhost:8000/api/status');
        setIsMaintenance(false);
      } catch (error) {
        if (error.response && error.response.status === 503) {
          setIsMaintenance(true);
        } else if (error.code === "ERR_NETWORK") {
          // Kalau server mati total, tampilkan maintenance juga
          setIsMaintenance(true);
        }
      } finally {
        setIsLoadingCheck(false);
      }
    };
    
    checkServerStatus();
    
    // Check setiap 30 detik
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (isLoadingCheck) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa server...</p>
        </div>
      </div>
    );
  }

  // Maintenance state
  if (isMaintenance) {
    return <MaintenancePage />;
  }

  // Normal state - dengan routing yang benar
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <About />
            <Services />
            <Portfolio />
          </>
        } />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;