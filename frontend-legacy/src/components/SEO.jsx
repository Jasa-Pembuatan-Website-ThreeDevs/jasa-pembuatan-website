import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  return (
    <Helmet>
      {/* Judul Halaman (Browser Tab) */}
      <title>{title} | ThreeDevs</title>
      
      {/* Deskripsi untuk Google Search */}
      <meta name="description" content={description} />
      
      {/* Open Graph (Biar cantik pas di-share di WA/IG) */}
      <meta property="og:title" content={`${title} | ThreeDevs`} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
};

export default SEO;