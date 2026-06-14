import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kebijakan Privasi</h1>
        <p className="mb-4">
          Di ThreeDevs, kami sangat menghargai privasi Anda. Dokumen ini menjelaskan bagaimana kami mengelola data yang Anda berikan.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Kami hanya mengumpulkan data (Nama, Email, No HP) untuk keperluan komunikasi proyek.</li>
          <li>Kami tidak akan pernah menjual data Anda ke pihak ketiga manapun.</li>
          <li>Data login website (Username/Password) Anda disimpan dengan aman dan dapat Anda ubah setelah serah terima.</li>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;