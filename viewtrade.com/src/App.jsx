import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// Sayfaların importları
import WelcomePage from "./pages/WelcomePage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";

import FinanceNewsPage from "./pages/FinanceNewsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

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
  
  const [girisYapildiMi, setGirisYapildiMi] = useState(false);
  const [kullaniciGirisiDogrulandiMi, setkullaniciGirisiDogrulandiMi] = useState(false);
  
  const [girisTC, setGirisTC] = useState("");
  const [girisKullaniciAdi, setGirisKullaniciAdi] = useState("");
  const [girisSifre, setGirisSifre] = useState("");
  
  const [kayitTC, setkayitTC] = useState("");
  const [kayitKullaniciAdi, setkayitKullaniciAdi] = useState("");
  const [kayitSifre, setkayitSifre] = useState("");
  

    useEffect(() => {
      console.log("Giriş Durumu:", girisYapildiMi);
      console.log("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
      console.log("Giriş TC:", girisTC);
      console.log("Giriş Kullanıcı adı:", girisKullaniciAdi);
      console.log("Giriş Şifre:", girisSifre);
    }, [girisYapildiMi]);

    const girisYap = () => {
      // 1. Önce kontrolü yapıyoruz
      if (girisTC.trim() !== "" && girisKullaniciAdi.trim() !== "" && girisSifre.trim() !== "") {
        
        // 2. State'leri güncelle
        setGirisYapildiMi(true);
        setkullaniciGirisiDogrulandiMi(true);
        
        // 3. Modal'ı veya giriş penceresini kapat (Hemen burada yap!)
        setgirisYapAcikmi(false); 
        
        // 4. Başarı mesajını patlat
        toast.success("Giriş Başarılı! Yönlendiriliyorsunuz.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        
      } else {
        // 5. Hata durumu
        toast.error("Lütfen bütün alanları eksiksiz doldurun.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
    };

    // const girisKontrol () = => {
    //   if (setGirisYapildiMi === true) {
    //     setgirisYapAcikmi(false)
    //   }
    // }

  return (
    <div className="min-h-screen text-white bg-[#1a1d1e] font-cyber-tech">
      <header className="sticky top-0 z-[100] backdrop-blur-md">
        {/* 1. ÜST KATMAN: Logo ve Arama Motoru */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-white/5 bg-[#020617]/80">
          <div>
            <Link to="/" className="no-underline">
              <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 cursor-pointer hover:opacity-80 transition-all active:scale-95">
                viewtrade<span className="text-white">.com</span>
              </h1>
            </Link>
            <p className="text-[9px] font-mono text-gray-500 tracking-[0.2em] mt-1">
              Kuantum İşlem Terminali // v1.1.1-beta
            </p>
          </div>

          {/* GELİŞMİŞ ARAMA MOTORU (Aynı kalıyor) */}
          <div className="relative group">
            <div className="flex items-center h-[40px] bg-[#1a1d1e] rounded-xl border border-white/10 focus-within:border-emerald-500/50 transition-all overflow-hidden">
              <button 
                onClick={toggleSearchMode}
                className={`flex items-center justify-center w-12 h-full border-r border-white/10 ${searchMode === 'crypto' ? 'text-orange-500' : 'text-emerald-500'}`}
              >
                {searchMode === 'crypto' ? <i className="fab fa-bitcoin"></i> : <i className="fas fa-chart-line"></i>}
              </button>
              <input className="w-[300px] lg:w-[450px] bg-transparent text-white px-4 text-xs focus:outline-none" placeholder={searchMode === 'crypto' ? "Kripto Ara..." : "Borsa Ara..."}value={searchQuery}onChange={handleSearch}/>
            </div>
            {/* Dropdown Sonuçları Kısmı (Aynı kalıyor) */}
          </div>

          {/* Giriş/Kayıt Butonları */}
          {/* <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
              <button onClick={() => setgirisYapAcikmi(true)} className="px-4 py-1.5 text-white text-[10px] font-black tracking-widest hover:bg-white/10 rounded-full transition-all">
                Kullanıcı Girişi
              </button>
              <button onClick={() => sethesapOlusturAcikmi(true)} className="px-4 py-1.5 bg-emerald-500 text-[#020617] text-[10px] font-black tracking-widest hover:bg-emerald-400 rounded-full transition-all ml-1">
                Kayıt ol
              </button>
          </div> */}
          <div className="relative group cursor-pointer" onClick={() => setAcikMenu(acikMenu === 'kullanici' ? null : 'kullanici')}>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
              <button onClick={() => setAcikMenu(acikMenu === 'kullanici' ? null : 'kullanici')} className="px-4 py-1.5 text-white text-[10px] font-black tracking-widest hover:bg-white/10 rounded-full transition-all">
                <i className='fas fa-user'></i>
              </button>
              {acikMenu === 'kullanici' && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1d1e] border border-white/10 rounded-lg py-2 shadow-2xl z-[101]">
                <Link to="/portfolio" className="no-underline text-white block px-4 py-2 hover:bg-emerald-500/10 hover:text-emerald-400">
                  <i className="fas fa-wallet text-[8px] mr-2"></i> Portföyüm
                </Link>
                <Link to="/user/settings" className="no-underline text-white block px-4 py-2 hover:bg-emerald-500/10 hover:text-emerald-400">
                  <i className="fas fa-cog text-[8px] mr-2"></i> Ayarlar
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* 2. ALT KATMAN: Navigasyon Menüsü (İstediğin Çizgi Altı Kısım) */}
        <nav className="flex items-center px-8 py-3 border-b border-white/10 bg-[#1a1d1e] gap-8">
          <Link to="/" className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-emerald-400 transition-colors no-underline flex items-center gap-2">
            <i className="fas fa-home text-[8px]"></i> Ana Sayfa
          </Link>
          <Link to="/portfolio" className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-emerald-400 transition-colors no-underline flex items-center gap-2">
            <i className="fas fa-wallet text-[8px]"></i> Portföyüm
          </Link>
          
          <div className="relative group cursor-pointer" onClick={() => setAcikMenu(acikMenu === 'piyasalar' ? null : 'piyasalar')}>
            <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
              <i className="fas fa-globe text-[8px]"></i> Piyasalar <i className={`fas fa-chevron-down text-[7px] transition-transform ${acikMenu === 'piyasalar' ? 'rotate-180' : ''}`}></i>
            </span>
            {acikMenu === 'piyasalar' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1d1e] border border-white/10 rounded-lg py-2 shadow-2xl z-[101]">
                <Link to="/markets/coin" className="no-underline text-white block px-4 py-2 hover:bg-emerald-500/10 hover:text-emerald-400">Coin Piyasası</Link>
                <Link to="/markets/stock" className="no-underline text-white block px-4 py-2 hover:bg-emerald-500/10 hover:text-emerald-400">Borsa Piyasası</Link>
              </div>
            )}
          </div>
        </nav>
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
          <Route path="/news/finance" element={<FinanceNewsPage />} />
          <Route path="/user/settings" element={<SettingsPage />} />
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
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">T.C. Kimlik Numarası</label>
                    <div className="relative">
                      <input type="text" value={girisTC} onChange={(e) => setGirisTC(e.target.value)} placeholder="***********" maxLength="11" minLength="11" className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" required/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Kullanıcı Adı</label>
                    <div className="relative">
                      <input type="text" value={girisKullaniciAdi} onChange={(e) => setGirisKullaniciAdi(e.target.value)} placeholder="Kullanıcı Adınızı Girin..." className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" required/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Şifre</label>
                    <div className="relative">
                      <input type="password" value={girisSifre} onChange={(e) => setGirisSifre(e.target.value)} placeholder="Şifrenizi Girin..." className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" required/>
                    </div>
                  </div>

                  {/* Onay Butonu */}
                  <button onClick={girisYap} id="girisYapButton" className="w-full py-4 bg-neon-green rounded-01 text-white font-black hover:brightness-110 active:scale-[0.98] transition-all text-xs tracking-[0.3em]" >
                    Giriş Yap
                  </button>
                </div>
              </div>
            </div>
          )}

          {hesapOlusturAcikmi && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
              {/* Backdrop (Karartma ve Tıklayınca Kapatma) */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => sethesapOlusturAcikmi(false)}></div>
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
                          <input type="text" placeholder="***********" maxLength="11" minLength="11" className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                        </div>
                      </div>
                    </div>
                    <div className='w-[40%]'>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Doğum Tarihi</label>
                        <div className="relative">
                          <input type="date" placeholder="gg.aa.yyyy" className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-[0.15em]">Ad</label>
                      <input type="text" placeholder="Adınızı Girin..." className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 tracking-[0.15em]">Soyad</label>
                      <input type="text" placeholder="Soyadınızı Girin..." className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Kullanıcı Adı</label>
                    <div className="relative">
                      <input type="text" placeholder="Kullanıcı Adınızı Oluşturun..." className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Şifre</label>
                    <div className="relative">
                      <input type="password" placeholder="Şifrenizi Oluşturun..." className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Şifre Tekrar</label>
                    <div className="relative">
                      <input type="password" placeholder="Şifrenizi Tekrar Girin..." className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-1 rounded-01 border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out"/>
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
      <ToastContainer theme="dark" />
    </Router>
  );
}

export default App;