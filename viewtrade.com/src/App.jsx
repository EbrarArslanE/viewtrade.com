import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Sayfaların importları
import WelcomePage from "./pages/WelcomePage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";

import CoinMarketPage from "./pages/CoinMarketPage.jsx";
import StockMarketPage from "./pages/StockMarketPage.jsx";

import CoinDetailPage from "./pages/coinPage.jsx";
import ExchangeDetailPage from "./pages/exchangePage.jsx";

// 🍏 TÜM MANTIK BURADA: useNavigate artık Router'ın içinde olduğu için çalışacak
function ViewTradeTerminal() {
const navigate = useNavigate();
  
  const [acikMenu, setAcikMenu] = useState(null);
  const [girisYapAcikmi, setgirisYapAcikmi] = useState(false);
  const [hesapOlusturAcikmi, sethesapOlusturAcikmi] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 🍏 YENİ: Arama Modu State'i (crypto veya stock)
  const [searchMode, setSearchMode] = useState('crypto');

  const allAssets = [
    { symbol: "BTCUSDT", name: "Bitcoin", type: "crypto" },
    { symbol: "ETHUSDT", name: "Ethereum", type: "crypto" },
    { symbol: "TSLA", name: "Tesla Inc.", type: "stock" },
    { symbol: "AAPL", name: "Apple Inc.", type: "stock" },
    { symbol: "SOLUSDT", name: "Solana", type: "crypto" },
    { symbol: "NVDA", name: "NVIDIA Corp.", type: "stock" },
    { symbol: "MBG.DE", name: "Mercedes-Benz", type: "stock" },
  ];

  // 🍏 MOD DEĞİŞTİRME FONKSİYONU
  const toggleSearchMode = () => {
    const newMode = searchMode === 'crypto' ? 'stock' : 'crypto';
    setSearchMode(newMode);
    setSearchQuery(""); // Mod değişince aramayı temizle
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toUpperCase();
    setSearchQuery(query);
    
    if (query.length > 0) {
      // 🍏 Sadece seçili moddaki assetleri filtrele
      const filtered = allAssets.filter(item => 
        item.type === searchMode && 
        (item.symbol.includes(query) || item.name.toUpperCase().includes(query))
      ).slice(0, 10);
      
      setResults(filtered);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleSelect = (item) => {
    const path = item.type === 'crypto' 
      ? `/detail/coin/${item.symbol}` 
      : `/detail/exchange/${item.symbol}`;
    
    navigate(path);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen text-white bg-cyber-black font-sans">
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
        
        {/* 🍏 GELİŞMİŞ ARAMA MOTORU */}
        <div className="relative group">
          <div className="flex items-center h-[40px] bg-[#1a1d1e] rounded-xl border border-white/10 focus-within:border-neon-green/50 transition-all overflow-hidden shadow-2xl">
            
            {/* 🍏 MOD TOGGLE BUTTON (Sol taraf) */}
            <button 
              onClick={toggleSearchMode}
              title={searchMode === 'crypto' ? "Borsaya Geç" : "Kriptoya Geç"}
              className={`flex items-center justify-center w-12 h-full transition-all duration-500 border-r border-white/10
                ${searchMode === 'crypto' 
                  ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' 
                  : 'bg-neon-green/10 text-neon-green hover:bg-neon-green/20'}`}
            >
              {searchMode === 'crypto' ? (
                <i className="fab fa-bitcoin text-lg"></i>
              ) : (
                <i className="fas fa-chart-line text-lg"></i>
              )}
            </button>

            <input 
              className="w-[300px] lg:w-[450px] bg-transparent text-white px-4 py-2 text-sm focus:outline-none placeholder:text-white/20" 
              type="text" 
              placeholder={searchMode === 'crypto' ? "Kripto Varlık Ara (BTC, ETH...)" : "Global Borsa Ara (TSLA, MBG...)"}
              value={searchQuery}
              onChange={handleSearch}
            />
            
            <div className="px-4 text-white/30 border-l border-white/10">
              <i className='fas fa-search'></i>
            </div>
          </div>

          {/* 🍏 DROP-DOWN SONUÇLARI */}
          {isDropdownOpen && (
            <div className="absolute top-[110%] left-0 w-full bg-[#1a1d1e] border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-50">
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[9px] font-black tracking-widest text-gray-500 uppercase">
                {searchMode === 'crypto' ? 'Kripto Sonuçları' : 'Borsa Sonuçları'}
              </div>
              {results.length > 0 ? results.map((item) => (
                <div 
                  key={item.symbol}
                  onClick={() => handleSelect(item)}
                  className="flex justify-between items-center px-4 py-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${item.type === 'crypto' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {item.symbol.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-neon-green transition-colors">{item.symbol}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{item.name}</span>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-[10px] text-white/10 group-hover:text-neon-green transition-all transform group-hover:translate-x-1"></i>
                </div>
              )) : (
                <div className="p-8 text-center">
                   <i className="fas fa-search-minus text-2xl text-gray-700 mb-2"></i>
                   <p className="text-xs text-gray-500 italic">Eşleşen varlık bulunamadı...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sağ Menüler */}
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black tracking-widest text-gray-400">
            <Link to="/" className="hover:text-neon-green transition-colors no-underline">Ana Sayfa</Link>
            <Link to="/portfolio" className="hover:text-neon-green transition-colors no-underline">Portföyüm</Link>
            
            <div className="relative group cursor-pointer" onClick={() => setAcikMenu(acikMenu === 'piyasalar' ? null : 'piyasalar')}>
              <span className="flex items-center gap-1 hover:text-neon-green transition-colors">
                Piyasalar <i className={`fas fa-chevron-down text-[8px] transition-transform ${acikMenu === 'piyasalar' ? 'rotate-180' : ''}`}></i>
              </span>
              {acikMenu === 'piyasalar' && (
                <div className="absolute top-full left-0 mt-4 w-48 bg-[#1a1d1e] border border-white/10 rounded-lg py-2 shadow-2xl z-[101]">
                  <Link to="/markets/coin" className="no-underline text-white">
                    <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Coin Piyasası</div>
                  </Link>
                  <Link to="/markets/stock" className="no-underline text-white">
                    <div className="px-4 py-2 hover:bg-white/5 hover:text-neon-green transition-all">Borsa Piyasası</div>
                  </Link>
                </div>
              )}
            </div>
          </nav>
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

      {/* 🍏 SAYFA İÇERİKLERİ */}
      <main className="w-full">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/markets/coin" element={<CoinMarketPage />} />
          <Route path="/markets/stock" element={<StockMarketPage />} />
          <Route path="/detail/coin/:symbol" element={<CoinDetailPage />} />
          <Route path="/detail/exchange/:symbol" element={<ExchangeDetailPage />} />
          <Route path="*" element={<div className="text-center pt-20">404 - Not Found</div>} />
        </Routes>
      </main>

      {/* MODALLAR (Giriş / Kayıt) */}
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
  );
}

// 🍏 ANA SARMALAYICI: Router her zaman en üstte olmalı
function App() {
  return (
    <Router>
      <ViewTradeTerminal />
    </Router>
  );
}

export default App;