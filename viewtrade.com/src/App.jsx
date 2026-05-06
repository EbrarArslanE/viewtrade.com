import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import WelcomePage from "./pages/WelcomePage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";

function App() {
  const [acikMenu, setAcikMenu] = useState(null);
  const [girisYapAcikmi, setgirisYapAcikmi] = useState(false);
  const [hesapOlusturAcikmi, sethesapOlusturAcikmi] = useState(false);
    
  return (
    <Router>
      <div className="min-h-screen text-white">
        
        {/* 🍏 HEADER: Burası her sayfada sabit kalacak kısım */}
        <header className="flex justify-between items-center px-8 py-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-[100]">
          <div>
            <Link to="/" className="no-underline">
              <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-neon-green to-cyan-400 cursor-pointer hover:opacity-80 transition-all active:scale-95">
                viewtrade<span className="text-white">.com</span>
              </h1>
            </Link>
            <p className="text-[10px] font-mono text-gray-500 tracking-[0.2em] mt-1">
              Kuantum İşlem Terminali // v1.1.1-beta
            </p>
          </div>
          
          {/* Arama Çubuğu */}
          <div className="hidden md:flex gap-6 mr-6 text-xs font-bold text-gray-400">
            <div className="flex h-[34px] text-[14px] text-white/60">
              <input className="input w-[400px] lg:w-[600px] bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-l-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-neon-green transition-all" type="text" placeholder="Coin Ara..." />
              <button className="text-[#f4f4f5] px-3 py-1 rounded-r-lg border-y border-r border-white/10 hover:bg-zinc-800/40 transition-all">
                <i className='fas fa-search'></i>
              </button>
            </div>
          </div>

          {/* Menüler ve Butonlar */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black tracking-widest text-gray-400">
              <Link to="/" className="hover:text-neon-green transition-colors">Ana Sayfa</Link>
              <Link to="/portfolio" className="hover:text-neon-green transition-colors">Portföyüm</Link>
              
              {/* Dropdown Örneği (Piyasalar) */}
              <div className="relative group cursor-pointer" onClick={() => setAcikMenu(acikMenu === 'piyasalar' ? null : 'piyasalar')}>
                <span className="flex items-center gap-1 hover:text-neon-green transition-colors">
                  Piyasalar <i className={`fas fa-chevron-down text-[8px] transition-transform ${acikMenu === 'piyasalar' ? 'rotate-180' : ''}`}></i>
                </span>
                {acikMenu === 'piyasalar' && (
                   <div className="absolute top-full left-0 mt-4 w-48 bg-[#1a1d1e] border border-white/10 rounded-lg py-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Coin Piyasası</div>
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Borsa Piyasası</div>
                   </div>
                )}
              </div>
            </nav>

            {/* Auth Butonları */}
            <div className="flex items-center bg-neon-green/5 border border-neon-green/30 rounded-full p-1">
              <button onClick={() => setgirisYapAcikmi(true)} className="px-5 py-2 text-white text-[10px] font-black tracking-widest hover:bg-neon-green/20 rounded-full transition-all">
                Giriş Yap
              </button>
              <div className="h-4 w-[1px] bg-neon-green/30 mx-1"></div>
              <button onClick={() => sethesapOlusturAcikmi(true)} className="px-5 py-2 text-white text-[10px] font-black tracking-widest hover:bg-neon-green/20 rounded-full transition-all">
                Hesap Oluştur
              </button>
            </div>
          </div>
        </header>

        {/* 🍏 MAIN: Sayfa içerikleri burada değişecek (Header dışında!) */}
        <main className="w-full">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="*" element={<div className="text-center pt-20">404 - Not Found</div>} />
          </Routes>
        </main>

        {/* Modallar (Giriş ve Hesap Oluştur - Kodun çok uzun olmaması için senin mantığını korudum) */}
        {/* ... (Senin girisYapAcikmi ve hesapOlusturAcikmi modalların buraya gelecek) ... */}

      </div>
    </Router>
  );
}

export default App;