import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StockMarketPage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seciliHisse, setSeciliHisse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🍏 DEVELOPER NOTU: Backend'imiz artık Node.js üzerinden konuştuğu için
  // Frontend'i kirletmiyoruz, veriyi bizim proxy'den çekiyoruz.
  const fetchBorsaData = async () => {
    try {
      setLoading(true);
      // Kanka burada kendi Node.js server portun neyse onu yaz (Örn: 5000)
      const response = await axios.get('http://localhost:5001/api/stocks/defaults');

      // Node.js tarafında temizlediğimiz veri buraya "cuk" diye oturuyor
      const formattedData = response.data.map(s => ({
        ...s,
        name: getNameBySymbol(s.symbol), // İsimleri eşliyoruz
        lastPrice: s.price.toFixed(2),
        priceChangePercent: s.percentChange.toFixed(2),
        quoteVolume: (s.price * 1500000), // Finnhub quote'da hacim bazen kısıtlıdır, simüle ediyoruz
        sector: getSectorBySymbol(s.symbol),
        market: s.symbol.includes('.') ? "XETRA" : "NASDAQ"
      }));

      setStocks(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("ViewTrade Veri Motoru Su Kaynattı kanka:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorsaData();
    // 30 saniyede bir otomatik tazele, piyasa canlı kalsın
    const interval = setInterval(fetchBorsaData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Yardımcı Fonksiyonlar (Street Smarts)
  const getNameBySymbol = (s) => {
    const names = { "AAPL": "Apple Inc.", "TSLA": "Tesla Inc.", "NVDA": "NVIDIA", "MSFT": "Microsoft", "AMZN": "Amazon", "META": "Meta", "MBG.DE": "Mercedes-Benz", "NFLX": "Netflix" };
    return names[s] || s;
  };

  const getSectorBySymbol = (s) => {
    if (s === "MBG.DE") return "Otomotiv";
    if (["NVDA", "AAPL", "MSFT"].includes(s)) return "Yarı İletken & Yazılım";
    return "Teknoloji";
  };

  const totalVolume = stocks.reduce((acc, s) => acc + parseFloat(s.quoteVolume), 0);
  const enCokArtan = [...stocks].sort((a, b) => b.priceChangePercent - a.priceChangePercent)[0];
  const enCokAzalan = [...stocks].sort((a, b) => a.priceChangePercent - b.priceChangePercent)[0];

  return (
    <div className="w-full min-h-screen bg-[#1a1d1e] text-white pb-10 px-8 font-sans">

      {/* 🍏 İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-12 gap-6 pt-8 mb-8">
        <div className="col-span-12 md:col-span-4 bg-white/[0.02] border border-white/10 p-6 rounded-[24px] backdrop-blur-md shadow-lg">
           <span className="text-[10px] text-gray-500 font-black tracking-widest">Piyasa Hacmi (Simüle)</span>
           <h2 className="text-2xl font-black text-white mt-2">${(totalVolume / 1000000).toFixed(2)}M</h2>
        </div>
        <div className="col-span-12 md:col-span-4 bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[24px] backdrop-blur-md shadow-lg">
          <span className="text-[10px] text-gray-500 font-black tracking-widest">Günün Lideri</span>
           <h2 className="text-2xl font-black text-emerald-400 mt-2">{enCokArtan?.symbol} <span className="text-sm">▲%{enCokArtan?.priceChangePercent}</span></h2>
        </div>
        <div className="col-span-12 md:col-span-4 bg-red-500/5 border border-red-500/20 p-6 rounded-[24px] backdrop-blur-md shadow-lg">
          <span className="text-[10px] text-gray-500 font-black tracking-widest">Günün Kaybedeni</span>
           <h2 className="text-2xl font-black text-red-400 mt-2">{enCokAzalan?.symbol} <span className="text-sm">▼%{enCokAzalan?.priceChangePercent}</span></h2>
        </div>
      </div>

      {/* 🍏 FİLTRELEME & ARAMA */}
      <div className="bg-[#1a1d1e] flex flex-row gap-5 border border-white/5 p-8 mb-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex flex-row flex-wrap gap-5 items-end w-[500px]">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[11px] font-bold text-gray-500 tracking-widest ml-1">Varlık Ara</label>
            <input className="w-full bg-white/5 text-[12px] text-white font-mono px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-emerald-400/40 transition-all shadow-inner" type="text" placeholder="Sembol ara (Örn: AAPL, TSLA)..." onChange={(e) => setSearchTerm(e.target.value.t())} />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-[300px]">
          <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] ml-1">Piyasa Filtresi</label>
          <div className="relative group">
            <select className="w-full bg-[#1a1f20] text-[#f4f4f5] text-[12px] font-mono px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-emerald-400/40 appearance-none cursor-pointer transition-all hover:bg-white/5 shadow-inner"onChange={(e) => console.log("Seçilen Filtre:", e.target.value)}>
              <option value="all">Tüm Varlıklar</option>
              <option value="gainers" className="text-emerald-400">🔥 En Çok Yükselenler</option>
              <option value="losers" className="text-rose-400">📉 En Çok Düşenler</option>
              <option value="volume">📊 En Yüksek Hacim</option>
              <option value="new">🆕 Yeni Listelenenler</option>
            </select>
            
            {/* Özel Ok İkonu (Minimalist) */}
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 🍏 BORSA TABLOSU */}
      <div className="bg-[#111315]/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr className="text-[11px] text-gray-500 tracking-[0.2em] font-black">
              <th className="p-6">Sembol</th>
              <th className="p-6">Şirket / Sektör</th>
              <th className="p-6 text-right">Fiyat</th>
              <th className="p-6 text-center">Değişim</th>
              <th className="p-6 text-right">Hacim</th>
              <th className="p-6 text-center">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-20 text-center">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-400 mx-auto"></div>
                   <p className="mt-4 font-mono text-[10px] tracking-widest text-gray-500">Devler Yükleniyor...</p>
                </td>
              </tr>
            ) : (
              stocks.filter(s => s.symbol.includes(searchTerm)).map((stock) => (
                <tr key={stock.symbol} onClick={() => setSeciliHisse(stock)} className="hover:bg-white/[0.03] transition-all cursor-pointer group">
                  <td className="p-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center font-black text-xs group-hover:border-emerald-400/50 transition-all">
                      {stock.symbol.split('.')[0]}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{stock.name}</span>
                      <span className="text-[10px] text-gray-500 font-black">{stock.sector}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right font-mono font-bold text-white">
                    ${stock.lastPrice}
                  </td>
                  <td className={`p-6 text-center font-mono font-black ${parseFloat(stock.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {parseFloat(stock.priceChangePercent) >= 0 ? '▲' : '▼'} %{stock.priceChangePercent}
                  </td>
                  <td className="p-6 text-right text-gray-500 font-mono text-xs">
                    {Math.floor(stock.quoteVolume / 1000).toLocaleString()}K
                  </td>
                  <td className="p-6 text-center">
                    <button className="btn-viewtrade group w-[100%] relative overflow-hidden">
	                  	<div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
	                  	<span className="relative z-10"> <i className='fas fa-eye mr-3'></i>Göz At</span>
	                  </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🍏 DETAY MODAL */}
      {seciliHisse && (
        <HisseDetayKart data={seciliHisse} onClose={() => setSeciliHisse(null)} />
      )}
    </div>
  );
};

const HisseDetayKart = ({ data, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
    <div className="bg-[#0d0f11] border border-white/10 w-full max-w-2xl rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
      <div className={`absolute -top-24 -right-24 w-80 h-80 blur-[120px] opacity-20 ${parseFloat(data.priceChangePercent) >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

      <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all">
        <i className="fas fa-times"></i>
      </button>

      <div className="mb-10">
        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-500 tracking-[0.2em]">
          {data.market} // {data.symbol}
        </span>
        <h2 className="text-6xl font-black text-white tracking-tighter mt-4">{data.name}</h2>
        <div className="flex items-baseline gap-4 mt-2">
          <p className="text-4xl font-mono font-black text-white/90">${data.lastPrice}</p>
          <span className={`text-lg font-bold ${parseFloat(data.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
             %{data.priceChangePercent}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <p className="text-[9px] text-gray-600 font-black tracking-widest">Sektör</p>
          <p className="text-lg font-bold mt-1 text-white/80">{data.sector}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <p className="text-[9px] text-gray-600 font-black tracking-widest">Tahmini Hacim</p>
          <p className="text-lg font-mono font-bold mt-1 text-white/80">${(data.quoteVolume / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      <button className="w-full py-5 bg-emerald-400 hover:bg-emerald-500 text-black font-black tracking-[0.3em] rounded-2xl transition-all shadow-[0_0_30px_rgba(52,211,153,0.2)]">
         Portföye Ekle
      </button>
    </div>
  </div>
);

export default StockMarketPage;
