import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Invoice = () => {
  const { orderId } = useParams(); // Ambil ID dari URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/invoice/${orderId}`);
        setOrder(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-20">Loading Invoice...</div>;
  if (!order) return <div className="text-center py-20">Invoice tidak ditemukan.</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg print:shadow-none">
          
          {/* Header Invoice */}
          <div className="flex justify-between items-center border-b pb-8 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">INVOICE</h1>
              <p className="text-sm text-gray-500">#{order.order_id}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold text-gray-700">ThreeDevs Agency</h2>
              <p className="text-xs text-gray-500">Team Company</p>
            </div>
          </div>

          {/* Info Client */}
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ditagihkan Kepada:</p>
            <h3 className="text-lg font-bold text-gray-800">{order.nama_pelanggan}</h3>
            <p className="text-gray-500">{order.email}</p>
            <p className="text-gray-500">{order.no_hp}</p>
          </div>

          {/* Tabel Item */}
          <div className="mb-8">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-t-lg border-b">
              <span className="font-bold text-gray-600">Layanan</span>
              <span className="font-bold text-gray-600">Harga</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b">
              <span className="text-gray-800 font-medium">{order.paket_layanan}</span>
              <span className="text-gray-800">Rp {parseInt(order.total_harga).toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="w-1/2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Status</span>
                <span className="font-bold text-green-600 uppercase">{order.status_pembayaran}</span>
              </div>
              <div className="flex justify-between py-4">
                <span className="text-xl font-bold text-indigo-900">Total</span>
                <span className="text-xl font-bold text-indigo-900">Rp {parseInt(order.total_harga).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi (Disembunyikan saat Print) */}
          <div className="flex gap-4 print:hidden">
            <button 
              onClick={handlePrint}
              className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Print / Save PDF
            </button>
            <Link 
              to="/"
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-center hover:bg-gray-50 transition"
            >
              Kembali ke Home
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Invoice;