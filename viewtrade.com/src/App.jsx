import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import WelcomePage from "./pages/WelcomePage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import CoinMarketPage from "./pages/CoinMarketPage.jsx";
import StockMarketPage from "./pages/StockMarketPage.jsx";

import CoinDetailPage from "./pages/coinPage.jsx";
import ExchangeDetailPage from "./pages/exchangePage.jsx";

function App() {
  const [acikMenu, setAcikMenu] = useState(null);
  // const [arananCoinBorsa, setarananCoinBorsa] = useState(null); henüz kullanılmıyor fakat coin borsa ara inputunda kullanılacak olan input bu değişkene bakacak
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
              <input className="input w-[400px] lg:w-[600px] bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-l-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-neon-green transition-all" type="text" placeholder="Coin - Borsa Ara..." />
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
                    <Link to="/markets/coin">
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Coin Piyasası</div>
                    </Link>
                    <Link to="/markets/stock">
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Borsa Piyasası</div>
                    </Link>
                   </div>
                )}
              </div>
              {/* <div className="relative group cursor-pointer" onClick={() => setAcikMenu(acikMenu === 'hizliListeler' ? null : 'hizliListeler')}>
                <span className="flex items-center gap-1 hover:text-neon-green transition-colors">
                  Hızlı Listeler <i className={`fas fa-chevron-down text-[8px] transition-transform ${acikMenu === 'hizliListeler' ? 'rotate-180' : ''}`}></i>
                </span>
                {acikMenu === 'hizliListeler' && (
                   <div className="absolute top-full left-0 mt-4 w-48 bg-[#1a1d1e] border border-white/10 rounded-lg py-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Popüler</div>
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Kazandıranlar</div>
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Kaybettirenler</div>
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">En Yüksek Piyasa Değeri</div>
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">En Düşük Piyasa Değeri</div>
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">En Yüksek Fiyat</div>
                      <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">En Düşük Fiyat</div>
                   </div>
                )}
              </div> */}
            </nav>

            {/* Auth Butonları */}
            <div className="flex items-center bg-neon-green/5 border border-neon-green/30 rounded-full p-1">
              <button onClick={() => setgirisYapAcikmi(true)} className="px-6 py-2.5 text-white text-[10px] font-black tracking-widest transition-all hover:bg-neon-green/30 active:scale-95 flex items-center rounded-full">
                <i className='far fa-user mr-3'></i>Giriş Yap
              </button>
              <div className="h-4 w-[1px] bg-neon-green/30 mx-1"></div>
              <button onClick={() => sethesapOlusturAcikmi(true)} className="px-6 py-2.5 text-white text-[10px] font-black tracking-widest transition-all hover:bg-neon-green/30 active:scale-95 flex items-center rounded-full">
                <i className='fas fa-user-plus mr-3'></i>Hesap Oluştur
              </button>
            </div>
          </div>
        </header>

        {/* 🍏 MAIN: Sayfa içerikleri burada değişecek (Header dışında!) */}
        <main className="w-full">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/markets/coin" element={<CoinMarketPage />} />
            <Route path="/markets/stock" element={<StockMarketPage />} />
            <Route path="/detail/coin" element={<CoinDetailPage />} />
            <Route path="/detail/exchange" element={<ExchangeDetailPage />} />
            <Route path="*" element={<div className="text-center pt-20">404 - Not Found</div>} />
          </Routes>
        </main>

        <div className="flex items-center bg-neon-green/5 border border-neon-green/30 rounded-01 p-0.5 overflow-hidden">
            {girisYapAcikmi && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                {/* Backdrop (Karartma ve Tıklayınca Kapatma) */}
                <div 
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  onClick={() => setgirisYapAcikmi(false)}
                ></div>

                {/* Modal Kartı */}
                <div className="relative w-full max-w-md bg-[#1a1d1e] border border-white/10 rounded-[6px] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-white font-black text-sm tracking-[0.2em]">Giriş Yap</h3>
                    <button onClick={() => setgirisYapAcikmi(false)} className="text-gray-500 hover:text-white transition-colors">
                      <i className="fas fa-times text-lg"></i>
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Tutar Girişi */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">T.C. Kimlik Numarası</label>
                      <div className="relative">
                        <input type="text" placeholder="***********" maxLength="11" minLength="11" className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 tracking-[0.15em]">Ad</label>
                        <input type="text" placeholder="Adınızı Girin..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 tracking-[0.15em]">Soyad</label>
                        <input type="text" placeholder="Soyadınızı Girin..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Kullanıcı Adı</label>
                      <div className="relative">
                        <input type="text" placeholder="Kullanıcı Adınızı Girin..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Şifre</label>
                      <div className="relative">
                        <input type="password" placeholder="Şifrenizi Girin..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                      </div>
                    </div>

                    {/* Onay Butonu */}
                    <button className="w-full py-4 bg-neon-green rounded-01 text-white font-black hover:brightness-110 active:scale-[0.98] transition-all text-xs tracking-[0.3em]">
                      Giriş Yap
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hesapOlusturAcikmi && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                {/* Backdrop (Karartma ve Tıklayınca Kapatma) */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md"onClick={() => sethesapOlusturAcikmi(false)}></div>
                {/* Modal Kartı */}
                <div className="relative w-full max-w-md bg-[#1a1d1e] border border-white/10 rounded-[6px] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-white font-black text-sm tracking-[0.2em]">Hesap Oluştur</h3>
                    <button onClick={() => sethesapOlusturAcikmi(false)} className="text-gray-500 hover:text-white transition-colors">
                      <i className="fas fa-times text-lg"></i>
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Tutar Girişi */}
                    <div className='flex w-full gap-4'>
                      <div className='w-[60%]'>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">T.C. Kimlik Numarası</label>
                          <div className="relative">
                            <input type="text" placeholder="***********" maxLength="11" minLength="11" className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                          </div>
                        </div>
                      </div>
                      <div className='w-[40%]'>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Doğum Tarihi</label>
                          <div className="relative">
                            <input type="date" placeholder="gg.aa.yyyy" className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 tracking-[0.15em]">Ad</label>
                        <input type="text" placeholder="Adınızı Girin..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 tracking-[0.15em]">Soyad</label>
                        <input type="text" placeholder="Soyadınızı Girin..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Kullanıcı Adı</label>
                      <div className="relative">
                        <input type="text" placeholder="Kullanıcı Adınızı Oluşturun..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Şifre</label>
                      <div className="relative">
                        <input type="password" placeholder="Şifrenizi Oluşturun..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Şifre Tekrar</label>
                      <div className="relative">
                        <input type="password" placeholder="Şifrenizi Tekrar Girin..." className="input w-full bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                      </div>
                    </div>
                      
                    </div>  

                    {/* Onay Butonu */}
                    <button className="w-full py-4 bg-neon-green rounded-01 text-white font-black hover:brightness-110 active:scale-[0.98] transition-all text-xs tracking-[0.3em]">
                      Hesap Oluştur
                    </button>
                  </div>
                </div>
              </div>
            )}   
        </div>

      </div>
    </Router>
  );
}

export default App;