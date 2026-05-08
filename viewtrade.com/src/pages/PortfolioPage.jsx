import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


// 1. ADIM: Grafik bileşeni her zaman ANA BİLEŞENİN DIŞINDA olmalı
  const TradingViewChart = ({ coin }) => {
    const container = useRef();

    useEffect(() => {
      if (!container.current) return;
      container.current.innerHTML = '';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": `BINANCE:${coin}USDT`,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "tr",
        "enable_publishing": false,
        "allow_symbol_change": false,
        "container_id": "tradingview_widget",
        "backgroundColor": "rgba(0, 0, 0, 0)",
        "gridColor": "rgba(42, 46, 57, 0.06)",
      });
      
      container.current.appendChild(script);
    }, [coin]);

    return (
      <div className="viewtrade-glass rounded-3xl p-2 h-[600px] border border-white/5 overflow-hidden">
        <div id="tradingview_widget" ref={container} className="w-full h-full"></div>
      </div>
    );
  };

  

function App() {
  // Fonksiyonlar
  const [acikMenu, setAcikMenu] = useState(null);

  const [piyasa, setPiyasa] = React.useState({
    BTC: { fiyat: "0.00", degisim: 0 },
    ETH: { fiyat: "0.00", degisim: 0 },
    SOL: { fiyat: "0.00", degisim: 0 },
    AVAX: { fiyat: "0.00", degisim: 0 }
  });
  
  const tamIsimler = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    SOL: "Solana",
    AVAX: "Avalanche"
  };
  
  const [seciliCoin, setSeciliCoin] = React.useState("BTC");

  React.useEffect(() => {
    let socket;
    
    const connect = () => {
      // Combined stream URL: Hepsini tek boru hattına bağladık
      const url = 'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/avaxusdt@ticker';
      socket = new WebSocket(url);

      socket.onmessage = (event) => {
        const zarf = JSON.parse(event.data);
        const veri = zarf.data; // Asıl fiyat verisi burada
        const coinSembol = zarf.stream.split('usdt')[0].toUpperCase(); // Örn: "BTC"

        // Sadece değişen coini güncelle, diğerlerini korur (Immutability - Sürdürülebilirlik)
        setPiyasa(onceki => ({
          ...onceki,
          [coinSembol]: {
            fiyat: parseFloat(veri.c).toLocaleString('en-US', { minimumFractionDigits: 2 }),
            degisim: parseFloat(veri.P)
          }
        }));
      };

      socket.onerror = (err) => console.error("Bağlantı Hatası:", err);

      socket.onclose = () => {
        console.log("Soket kapandı, tekrar bağlanıyor...");
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (socket) {
        socket.onclose = null; 
        socket.close();
      }
    };
  }, []);

  const [bakiyeYukleAcikMi, setbakiyeYukleAcikMi] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardType, setCardType] = React.useState('default');
  
  // 🍏 2. KART INPUT FONKSİYONU
  const handleCardInput = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedValue);
    
    if (value.startsWith('4')) {
      setCardType('visa');
    } else if (value.startsWith('5')) {
      setCardType('mastercard');
    } else {
      setCardType('default');
    }
  };

  const [girisYapAcikmi, setgirisYapAcikmi] = React.useState(false);
  const [hesapOlusturAcikmi, sethesapOlusturAcikmi] = React.useState(false);
  
  const [resitMi, setresitMi] = React.useState('');
  const yasKontrol = (girilenYas) => {
    const yasSiniri = 18
    if (!girilenYas || girilenYas < yasSiniri) {
      toast.error('Hesap Oluşturabilmek için 18 yaşından büyük olmak gereklidir!',{
        duration : 4000,
          style: {
            border: '1px solid #ef4444', 
          padding: '16px',
          color: '#f4f4f5',
          background: '#1a1d1e',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#1a1d1e',
        },
      })
      return false
    }
    toast.success("Hesap Başarıyla oluşturuldu, Portföyünüze yönlendiriliyorsunuz...",{
      style: {
        border: '1px solid #39FF14',
        padding: '16px',
        color: '#39FF14',
        background: '#1a1d1e',
      },
    })
    return true
  };
  
    return (
    <div className="min-h-screen p-4 md:p-8 font-sans selection:bg-neon-green selection:text-black bg-cyber-black text-white">
      {/* Üst Bar / Navigasyon */}

      {/* Ana Ekran Izgarası */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Grafik Alanı */}
        <div className="col-span-12 xl:col-span-8 group relative bg-white/[0.02] border border-white/10 rounded-01 p-6 backdrop-blur-3xl overflow-hidden hover:border-neon-green/30 transition-colors">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                <h2 className="text-2xl font-bold italic tracking-tight">{seciliCoin}</h2>
              </div>
              <p className="text-xs text-gray-500 font-mono tracking-widest">{tamIsimler[seciliCoin]} Ana Endeksi</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-mono font-bold text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                ${piyasa.BTC.fiyat}
              </p>
              <p className={`text-sm font-bold font-mono ${piyasa[seciliCoin]?.degisim >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {piyasa[seciliCoin]?.degisim >= 0 ? '▲' : '▼'} {piyasa[seciliCoin]?.degisim}%
              </p>
            </div>
          </div>
    
          {/* Grafik Alanı (Placeholder) */}
          <div className="h-[600px] w-full rounded-01 border border-white/5 bg-black/40 flex flex-col items-center justify-center relative group-hover:bg-black/20 transition-all overflow-hidden">
            
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            <div className="absolute inset-0 w-full h-full z-10">
              <TradingViewChart coin={seciliCoin} />
            </div>

            <div className="flex flex-col items-center justify-center z-0">
              <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xs text-gray-600 font-mono tracking-[0.3em] uppercase">
                Veri Akışı Bekleniyor (Socket)...
              </p>
            </div>
          </div>
        </div>

        {/* Sağ Panel */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* Takip Listesi (Watchlist) */}
          <div className="viewtrade-glass rounded-01 p-6">
            <h3 className="text-[16px] font-black text-white mb-6">Gündemdeki Coinler</h3>
            <div className="space-y-4">
              {Object.keys(piyasa).map((coin) => (
                <div key={coin} onClick={() => setSeciliCoin(coin)} className="flex justify-between items-center p-3 hover:bg-blue-400/10 rounded-xl transition-all border border-transparent hover:border-blue-400/20 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <i className='fas fa-heart'></i>
                    <div className={`w-1 h-8 rounded-full transition-colors duration-500 ${ piyasa[coin].degisim >= 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'  }`}></div>
                    <div>
                      <p className="font-bold text-sm tracking-tighter text-white group-hover:text-blue-400 transition-colors">{coin} / USDT</p>
                      <p className="text-[9px] text-blue-300/40 font-mono">{coin === 'BTC' ? 'Bitcoin Core' : coin === 'ETH' ? 'Ethereum L1' : 'Altcoin Index'}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-blue-100">
                      ${piyasa[coin].fiyat}
                    </p>
                    <p className={`text-[10px] font-bold ${piyasa[coin].degisim >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {piyasa[coin].degisim >= 0 ? '+' : ''}{piyasa[coin].degisim}%
                    </p>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

          {/* Hızlı İşlem Paneli */}
          <div className="bg-gradient-to-br from-neon-green/10 to-transparent border border-neon-green/20 rounded-01 p-6">
            <p className="text-[12px] font-mono text-neon-green mb-4 opacity-70 tracking-tighter">Hızlı İşlemler</p>
              
            <div className="flex items-center pb-5 justify-start gap-6">
              <p className="font-bold text-xl tracking-tighter text-white group-hover:text-blue-400 transition-colors">{seciliCoin}</p>
              <p className="font-bold text-xl tracking-tighter text-white group-hover:text-blue-400 transition-colors">-</p>
              
              <div className="flex items-center justify-center">
                <input className="input w-[300px] bg-[#2A3335] text-[#f4f4f5] px-3 py-1 rounded-l-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-[#09090b] transition-all duration-150 ease-in-out" name="text" type="text" placeholder="Almak İstediğiniz Tutar" />
                <div className="text-[#f4f4f5] px-3 py-1 rounded-r-lg border-y border-r border-r-white/10 border-y-white/10 transition-all duration-150 easy-in-out" >
                  <i className='fas fa-dollar'></i>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 bg-neon-green text-white font-black rounded-1 hover:brightness-110 active:scale-95 transition-all text-xs tracking-widest">
                  <i className="fas fa-plus-circle mr-2"></i>Al
                </button>
                <button className="py-4 bg-neon-green text-white font-black rounded-1 hover:brightness-110 active:scale-95 transition-all text-xs tracking-widest">
                  <i className="fas fa-minus-circle mr-2"></i>Sat
                </button>
              </div>
            
              <button className="btn-viewtrade group relative overflow-hidden">
                <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
                <span className="relative z-10">Flash Execute</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
      {/* <span>Powered by Ebrar Arslan</span> */}
    </div>
  );
}

export default App;