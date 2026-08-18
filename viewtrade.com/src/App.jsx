import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import WelcomePage from "./pages/WelcomePage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import FinanceNewsPage from "./pages/FinanceNewsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import WalletPage from "./pages/WalletPage.jsx";
import LiveMarketTerminal from "./pages/LiveMarketTerminal.jsx";
import CoinMarketPage from "./pages/CoinMarketPage.jsx";
import StockMarketPage from "./pages/StockMarketPage.jsx";
import CoinDetailPage from "./pages/coinPage.jsx";
import ExchangeDetailPage from "./pages/exchangePage.jsx";

function ViewTradeTerminal() {
  const navigate = useNavigate();

  const [acikMenu, setAcikMenu] = useState(null);
  const [girisYapAcikmi, setgirisYapAcikmi] = useState(false);
  const [hesapOlusturAcikmi, sethesapOlusturAcikmi] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const toggleSearchMode = () => {
    const newMode = searchMode === 'crypto' ? 'stock' : 'crypto';
    setSearchMode(newMode);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toUpperCase();
    setSearchQuery(query);

    if (query.length > 0) {
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

  // --- AUTH STATE'LERİ VE PERSISTENCE ---
  const [girisYapildiMi, setGirisYapildiMi] = useState(false);
  const [aktifKullanici, setAktifKullanici] = useState(null);

  // Giriş Form State'leri
  const [girisTC, setGirisTC] = useState("");
  const [girisKullaniciAdi, setGirisKullaniciAdi] = useState("");
  const [girisSifre, setGirisSifre] = useState("");

  // Kayıt Form State'leri
  const [kayitTC, setKayitTC] = useState("");
  const [kayitDogumTarihi, setKayitDogumTarihi] = useState("");
  const [kayitAd, setKayitAd] = useState("");
  const [kayitEmail, setKayitEmail] = useState(""); // 🍏 YENİ
  const [kayitTelefon, setKayitTelefon] = useState(""); // 🍏 YENİ
  const [kayitSoyad, setKayitSoyad] = useState("");
  const [kayitKullaniciAdi, setKayitKullaniciAdi] = useState("");
  const [kayitSifre, setKayitSifre] = useState("");
  const [kayitSifreTekrar, setKayitSifreTekrar] = useState("");

  // 🍏 Sayfa ilk açıldığında LocalStorage kontrolü
  useEffect(() => {
    const savedUser = localStorage.getItem("viewtrade_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setAktifKullanici(parsedUser);
      setGirisYapildiMi(true);
    }
  }, []);

  // 🍏 GİRİŞ YAP FONKSİYONU
  const girisYap = () => {
    if (girisTC.trim() !== "" && girisKullaniciAdi.trim() !== "" && girisSifre.trim() !== "") {
      const userObj = {
        tc: girisTC,
        username: girisKullaniciAdi
      };

      // State & Storage güncelle
      setAktifKullanici(userObj);
      setGirisYapildiMi(true);
      localStorage.setItem("viewtrade_user", JSON.stringify(userObj));

      // Modal kapat ve formu temizle
      setgirisYapAcikmi(false);
      setGirisTC("");
      setGirisKullaniciAdi("");
      setGirisSifre("");

      toast.success(`Hoş geldin, ${userObj.username}!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } else {
      toast.error("Lütfen bütün alanları eksiksiz doldurun.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  // 🍏 KAYIT OL FONKSİYONU
  const kayitOl = () => {
    if (!kayitTC || !kayitAd || !kayitSoyad || !kayitKullaniciAdi || !kayitSifre) {
      toast.error("Lütfen zorunlu alanları doldurun.", { theme: "dark" });
      return;
    }

    if (kayitSifre !== kayitSifreTekrar) {
      toast.error("Şifreler birbiriyle uyuşmuyor!", { theme: "dark" });
      return;
    }

    const newUser = {
      tc: kayitTC,
      name: `${kayitAd} ${kayitSoyad}`,
      username: kayitKullaniciAdi,
      email: kayitEmail || `${kayitKullaniciAdi}@viewtrade.com`, // Boşsa varsayılan atar
      phone: kayitTelefon || '',
      birthDate: kayitDogumTarihi || ''
    };

    setAktifKullanici(newUser);
    setGirisYapildiMi(true);
    localStorage.setItem("viewtrade_user", JSON.stringify(newUser));

    sethesapOlusturAcikmi(false);
    toast.success("Hesabınız başarıyla oluşturuldu!", { theme: "dark" });
  };

  // 🍏 ÇIKIŞ YAP FONKSİYONU
  const cikisYap = () => {
    localStorage.removeItem("viewtrade_user");
    setGirisYapildiMi(false);
    setAktifKullanici(null);
    setAcikMenu(null);
    toast.info("Oturum kapatıldı.", { position: "top-right", theme: "dark" });
  };

  return (
    <div className="min-h-screen text-white bg-[#1a1d1e] font-cyber-tech">
      <header className="sticky top-0 z-[100] backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-4 border-b border-white/5 bg-[#020617]/80">
          <div className='flex flex-row items-center justify-center gap-3 '>
            <Link to="/" className="no-underline">
              <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 cursor-pointer hover:opacity-80 transition-all active:scale-95">
                viewtrade<span className="text-white">.com</span>
              </h1>
            </Link>
            <Link to="/LiveMarketTerminal" className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-emerald-400 transition-colors no-underline flex items-center gap-2">
              <div className="flex items-center gap-3 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md cursor-pointer">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400">Canlı market akış terminali</span>
              </div>
            </Link>
          </div>

          {/* ARAMA MOTORU */}
          <div className="relative group">
            <div className="flex items-center h-[40px] bg-[#1a1d1e] rounded-xl border border-white/10 focus-within:border-emerald-500/50 transition-all overflow-hidden">
              <button
                onClick={toggleSearchMode}
                className={`flex items-center justify-center w-12 h-full border-r border-white/10 ${searchMode === 'crypto' ? 'text-orange-500' : 'text-emerald-500'}`}
              >
                {searchMode === 'crypto' ? <i className="fab fa-bitcoin"></i> : <i className="fas fa-chart-line"></i>}
              </button>
              <input
                className="w-[300px] lg:w-[450px] bg-transparent text-white px-4 text-xs focus:outline-none"
                placeholder={searchMode === 'crypto' ? "Kripto Ara..." : "Borsa Ara..."}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* SAĞ ÜST: GİRİŞ/KAYIT VEYA KULLANICI PROFİLİ */}
          <div className="flex items-center gap-3">
            {!girisYapildiMi ? (
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
                <button onClick={() => setgirisYapAcikmi(true)} className="px-4 py-1.5 text-white text-[10px] font-black tracking-widest hover:bg-white/10 rounded-full transition-all">
                  Kullanıcı Girişi
                </button>
                <button onClick={() => sethesapOlusturAcikmi(true)} className="px-4 py-1.5 bg-emerald-500 text-[#020617] text-[10px] font-black tracking-widest hover:bg-emerald-400 rounded-full transition-all ml-1">
                  Kayıt ol
                </button>
              </div>
            ) : (
              <div className="relative" onClick={() => setAcikMenu(acikMenu === 'kullanici' ? null : 'kullanici')}>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 cursor-pointer hover:bg-emerald-500/20 transition-all">
                  <i className='fas fa-user-circle text-emerald-400 text-sm'></i>
                  <span className="text-[11px] font-bold text-emerald-400">{aktifKullanici?.username}</span>
                </div>

                {acikMenu === 'kullanici' && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1d1e] border border-white/10 rounded-lg py-2 shadow-2xl z-[101]">
                    <Link to="/portfolio" className="no-underline text-white block px-4 py-2 text-xs hover:bg-emerald-500/10 hover:text-emerald-400">
                      <i className="fas fa-wallet mr-2"></i> Portföyüm
                    </Link>
                    <Link to="/user/settings" className="no-underline text-white block px-4 py-2 text-xs hover:bg-emerald-500/10 hover:text-emerald-400">
                      <i className="fas fa-cog mr-2"></i> Ayarlar
                    </Link>
                    <Link to="/user/settings" className="no-underline text-white block px-4 py-2 text-xs hover:bg-emerald-500/10 hover:text-emerald-400">
                      <i className="fas fa-cog mr-2"></i> Bakiye Yönetimi
                    </Link>
                    <div className="border-t border-white/10 my-1"></div>
                    <button onClick={cikisYap} className="w-full text-left text-red-400 block px-4 py-2 text-xs hover:bg-red-500/10">
                      <i className="fas fa-sign-out-alt mr-2"></i> Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ALT NAVİGASYON */}
        <nav className="flex items-center px-8 py-3 border-b border-white/10 bg-[#1a1d1e] gap-8">
          <Link to="/" className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-emerald-400 transition-colors no-underline flex items-center gap-2">
            <i className="fas fa-home text-[8px]"></i> Ana Sayfa
          </Link>
          <Link to="/news/finance" className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-emerald-400 transition-colors no-underline flex items-center gap-2">
            <i className="fas fa-newspaper text-[8px]"></i> Piyasadan Haberler
          </Link>

          <div className="relative group cursor-pointer" onClick={() => setAcikMenu(acikMenu === 'piyasalar' ? null : 'piyasalar')}>
            <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
              <i className="fas fa-globe text-[8px]"></i> Piyasalar <i className={`fas fa-chevron-down text-[7px] transition-transform ${acikMenu === 'piyasalar' ? 'rotate-180' : ''}`}></i>
            </span>
            {acikMenu === 'piyasalar' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1d1e] border border-white/10 rounded-lg py-2 shadow-2xl z-[101]">
                <Link to="/markets/coin" className="no-underline text-white block px-4 py-2 text-xs hover:bg-emerald-500/10 hover:text-emerald-400">Coin Piyasası</Link>
                <Link to="/markets/stock" className="no-underline text-white block px-4 py-2 text-xs hover:bg-emerald-500/10 hover:text-emerald-400">Borsa Piyasası</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* SAYFA ROUTER İÇERİKLERİ */}
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
          <Route path="/user/wallet" element={<WalletPage />} />
          <Route path="/LiveMarketTerminal" element={<LiveMarketTerminal />} />
          <Route path="*" element={<div className="text-center pt-20">404 - Not Found</div>} />
        </Routes>
      </main>

      {/* MODALLAR */}
      {girisYapAcikmi && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setgirisYapAcikmi(false)}></div>
          <div className="relative w-full max-w-md bg-[#1a1d1e] border border-white/10 rounded-[6px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-white font-black text-sm tracking-[0.2em]">Giriş Yap</h3>
              <button onClick={() => setgirisYapAcikmi(false)} className="text-gray-500 hover:text-white">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">T.C. Kimlik Numarası</label>
                <input type="text" value={girisTC} onChange={(e) => setGirisTC(e.target.value)} placeholder="***********" maxLength="11" className="w-full bg-[#1a1d1e] text-white px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-emerald-500 text-xs"/>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Kullanıcı Adı</label>
                <input type="text" value={girisKullaniciAdi} onChange={(e) => setGirisKullaniciAdi(e.target.value)} placeholder="Kullanıcı Adı..." className="w-full bg-[#1a1d1e] text-white px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-emerald-500 text-xs"/>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">Şifre</label>
                <input type="password" value={girisSifre} onChange={(e) => setGirisSifre(e.target.value)} placeholder="Şifre..." className="w-full bg-[#1a1d1e] text-white px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-emerald-500 text-xs"/>
              </div>

              <button onClick={girisYap} className="w-full py-3 bg-emerald-500 text-[#020617] font-black rounded hover:bg-emerald-400 transition-all text-xs tracking-[0.3em]">
                Giriş Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {hesapOlusturAcikmi && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => sethesapOlusturAcikmi(false)}></div>
          <div className="relative w-full max-w-md bg-[#1a1d1e] border border-white/10 rounded-[6px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-white font-black text-sm tracking-[0.2em]">Hesap Oluştur</h3>
              <button onClick={() => sethesapOlusturAcikmi(false)} className="text-gray-500 hover:text-white">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className='flex gap-4'>
                <div className='w-[60%] space-y-1'>
                  <label className="text-[10px] font-bold text-gray-500">T.C. Kimlik No</label>
                  <input type="text" value={kayitTC} onChange={(e) => setKayitTC(e.target.value)} maxLength="11" className="w-full bg-[#1a1d1e] text-white px-3 py-1.5 rounded border border-white/10 text-xs"/>
                </div>
                <div className='w-[40%] space-y-1'>
                  <label className="text-[10px] font-bold text-gray-500">Doğum Tarihi</label>
                  <input type="date" value={kayitDogumTarihi} onChange={(e) => setKayitDogumTarihi(e.target.value)} className="w-full bg-[#1a1d1e] text-white px-2 py-1.5 rounded border border-white/10 text-xs"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500">Ad</label>
                  <input type="text" value={kayitAd} onChange={(e) => setKayitAd(e.target.value)} className="w-full bg-[#1a1d1e] text-white px-3 py-1.5 rounded border border-white/10 text-xs"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500">Soyad</label>
                  <input type="text" value={kayitSoyad} onChange={(e) => setKayitSoyad(e.target.value)} className="w-full bg-[#1a1d1e] text-white px-3 py-1.5 rounded border border-white/10 text-xs"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500">Kullanıcı Adı</label>
                <input type="text" value={kayitKullaniciAdi} onChange={(e) => setKayitKullaniciAdi(e.target.value)} className="w-full bg-[#1a1d1e] text-white px-3 py-1.5 rounded border border-white/10 text-xs"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500">Şifre</label>
                  <input type="password" value={kayitSifre} onChange={(e) => setKayitSifre(e.target.value)} className="w-full bg-[#1a1d1e] text-white px-3 py-1.5 rounded border border-white/10 text-xs"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500">Şifre Tekrar</label>
                  <input type="password" value={kayitSifreTekrar} onChange={(e) => setKayitSifreTekrar(e.target.value)} className="w-full bg-[#1a1d1e] text-white px-3 py-1.5 rounded border border-white/10 text-xs"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500">E-Posta Adresi</label>
                <input
                  type="email"
                  value={kayitEmail}
                  onChange={(e) => setKayitEmail(e.target.value)}
                  placeholder="ornek@viewtrade.com"
                  className="w-full bg-[#1a1d1e] text-white px-3 py-1.5 rounded border border-white/10 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500">Telefon</label>
                <input
                  type="text"
                  value={kayitTelefon}
                  onChange={(e) => setKayitTelefon(e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className="w-full bg-[#1a1d1e] text-white px-3 py-1.5 rounded border border-white/10 text-xs"
                />
              </div>

              <button onClick={kayitOl} className="w-full py-3 bg-emerald-500 text-[#020617] font-black rounded hover:bg-emerald-400 transition-all text-xs tracking-[0.3em] mt-2">
                Hesap Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ViewTradeTerminal />
      <ToastContainer theme="dark" />
    </Router>
  );
}

export default App;
