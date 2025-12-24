import React, { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import ContactPage from './pages/Contact'
import Faq from './pages/Faq'
import NotFound from './pages/NotFound'
import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import MaintenancePage from "./components/MaintenancePage"; // <--- IMPORT DISINI
import OrderPage from './pages/OrderPages'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import CTASection from './components/CTASection'
import ProjectDetail from './pages/ProjectDetail'
import TrackOrder from './pages/TrackOrder'
import Admin from './Dashboard-admin'
import LoginAdmin from './pages/LoginAdmin'
import OrderSuccess from './pages/OrderSuccess'

function App() {
 const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  useEffect(() => {
    // ... logika cek server sama seperti sebelumnya ...
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
  }, []);

  if (isLoadingCheck) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>; // Atau spinner
  }

  // === INI YANG DIUBAH ===
  // Kalau maintenance, panggil komponen MaintenancePage
  if (isMaintenance) {
    return <MaintenancePage />;
  }

  // === 2. TAMPILAN JIKA MAINTENANCE ===
  if (isMaintenance) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg border-b-4 border-red-500">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Sistem Sedang Perbaikan</h1>
          <p className="text-gray-600">
            Website sedang dalam pemeliharaan rutin oleh Tim Developer. 
            Silakan kembali lagi nanti.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Coba Refresh
          </button>
        </div>
      </div>
    );
  }
  return (
   <>
      <Routes>
        <Route path="/order" element={<OrderPage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path='/project-detail' element={<ProjectDetail />} />
        <Route path='/track' element={<TrackOrder />} />
        <Route path='/order-success' element={<OrderSuccess />} />
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <About />
            <Services />
            <Portfolio />
            <ContactPage />
            <CTASection />
            <Footer />
          </>
        } />
        <Route path="/dashboard/admin" element={<Admin />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App