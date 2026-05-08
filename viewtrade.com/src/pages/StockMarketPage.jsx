import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'd7uq1ihr01qnv95og81gd7uq1ihr01qnv95og820'; // Buraya kendi key'ini çak kanka

const fetchBorsaData = async () => {
  try {
    setLoading(true);
    // Takip edeceğimiz devler
    const semboller = ["AAPL", "TSLA", "NVDA", "MBG.DE", "MSFT", "AMZN"];
    
    const requests = semboller.map(s => 
      axios.get(`https://finnhub.io/api/v1/quote?symbol=${s}&token=${API_KEY}`)
    );

    // Tüm istekleri aynı anda atıyoruz, performans bizim işimiz!
    const responses = await Promise.all(requests);

    const data = responses.map((res, index) => {
      const q = res.data;
      return {
        symbol: semboller[index],
        name: semboller[index] === "MBG.DE" ? "Mercedes-Benz" : semboller[index], // İsimleri manuel veya profile API'den alabiliriz
        lastPrice: q.c.toFixed(2), // c: Current Price
        priceChangePercent: ((q.d / q.pc) * 100).toFixed(2), // d: Change, pc: Prev Close
        highPrice: q.h.toFixed(2),
        lowPrice: q.l.toFixed(2),
        quoteVolume: (q.v || 0) * q.c, // v: Volume (bazı hisselerde boş dönebilir)
        sector: "Global Market", // Profile API ile bu daha detaylı çekilebilir
        market: semboller[index].includes('.') ? "XETRA" : "NASDAQ"
      };
    });

    setStocks(data);
    console.log(data);
    
    setLoading(false);
  } catch (error) {
    console.error("Finnhub'dan veri çekilirken motor su kaynattı:", error);
    setLoading(false);
  }
};

const StockMarketPage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seciliHisse, setSeciliHisse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 🍏 DEVELOPER NOTU: Burası borsa tarafı olduğu için şimdilik 
    // Binance yerine senin o sağlam yapını dummy borsa verileriyle besliyoruz.
    // Backend gelince axios.get('senin-borsa-api-url') ile burayı patlatırsın.
    const fetchBorsaData = async () => {
      try {
        setLoading(true);
        // Gerçek API gelene kadar senin yapını simüle eden sağlam veri seti
        const dummyStocks = [
          { symbol: "MBG.DE", name: "Mercedes-Benz", lastPrice: "72.45", priceChangePercent: "1.24", quoteVolume: "15000000", highPrice: "73.10", lowPrice: "71.50", sector: "Otomotiv", market: "XETRA" },
          { symbol: "TSLA", name: "Tesla Inc.", lastPrice: "175.20", priceChangePercent: "-0.85", quoteVolume: "450000000", highPrice: "180.00", lowPrice: "172.00", sector: "Teknoloji", market: "NASDAQ" },
          { symbol: "AAPL", name: "Apple Inc.", lastPrice: "182.30", priceChangePercent: "0.45", quoteVolume: "320000000", highPrice: "184.50", lowPrice: "181.00", sector: "Teknoloji", market: "NASDAQ" },
          { symbol: "NVDA", name: "NVIDIA", lastPrice: "875.10", priceChangePercent: "3.12", quoteVolume: "890000000", highPrice: "880.00", lowPrice: "850.00", sector: "Yarı İletken", market: "NASDAQ" },
          { symbol: "ASML", name: "ASML Holding", lastPrice: "912.00", priceChangePercent: "0.15", quoteVolume: "45000000", highPrice: "920.00", lowPrice: "905.00", sector: "Yarı İletken", market: "Euronext" },
        ];
        
        setStocks(dummyStocks);
        setLoading(false);
      } catch (error) {
        console.error("Borsa verisi çekilemedi:", error);
      }
    };

    fetchBorsaData();
  }, []);

  // İstatistik Hesaplamaları (Senin koddaki mantıkla aynı)
  const totalVolume = stocks.reduce((acc, s) => acc + parseFloat(s.quoteVolume), 0);
  const enCokArtan = [...stocks].sort((a, b) => b.priceChangePercent - a.priceChangePercent)[0];
  const enCokAzalan = [...stocks].sort((a, b) => a.priceChangePercent - b.priceChangePercent)[0];

  return (
    <div className="w-full min-h-screen bg-[#1a1d1e] text-white pb-10 px-8 font-sans">
      
      {/* 🍏 İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-12 gap-6 pt-8 mb-8">
        <div className="col-span-12 md:col-span-4 bg-white/[0.02] border border-white/10 p-6 rounded-[24px] backdrop-blur-md">
           <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Piyasa Hacmi (Global)</span>
           <h2 className="text-2xl font-black text-white mt-2">${(totalVolume / 1000000).toFixed(2)}M</h2>
        </div>
        <div className="col-span-12 md:col-span-4 bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[24px] backdrop-blur-md">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Günün Lideri</span>
           <h2 className="text-2xl font-black text-emerald-400 mt-2">{enCokArtan?.symbol} <span className="text-sm">▲%{enCokArtan?.priceChangePercent}</span></h2>
        </div>
        <div className="col-span-12 md:col-span-4 bg-red-500/5 border border-red-500/20 p-6 rounded-[24px] backdrop-blur-md">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Günün Kaybedeni</span>
           <h2 className="text-2xl font-black text-red-400 mt-2">{enCokAzalan?.symbol} <span className="text-sm">▼%{enCokAzalan?.priceChangePercent}</span></h2>
        </div>
      </div>

      {/* 🍏 FİLTRELEME ALANI */}
      <div className="bg-[#1a1d1e] border border-white/5 p-8 mb-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex flex-row flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-2 w-[250px]">
            <label className="text-[11px] font-bold text-gray-500 tracking-widest ml-1 uppercase">Sektörel Dağılım</label>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[12px] text-white outline-none focus:border-neon-green/50 transition-all cursor-pointer">
              <option value="all">Tüm Sektörler</option>
              <option value="tech">Teknoloji</option>
              <option value="auto">Otomotiv</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[11px] font-bold text-gray-500 tracking-widest ml-1 uppercase">Varlık Ara</label>
            <div className="relative flex">
              <input 
                className="w-full bg-white/5 text-[12px] text-white font-mono px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-neon-green/40 transition-all" 
                type="text" 
                placeholder="Hisse adı veya sembol (Örn: MBG, TSLA)..."
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🍏 BORSA TABLOSU */}
      <div className="bg-[#111315]/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr className="text-[11px] text-gray-500 tracking-[0.2em] font-black uppercase">
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
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon-green mx-auto"></div>
                   <p className="mt-4 font-mono text-[10px] tracking-widest text-gray-500 uppercase">Veriler Yükleniyor...</p>
                </td>
              </tr>
            ) : (
              stocks.filter(s => s.symbol.includes(searchTerm)).map((stock) => (
                <tr key={stock.symbol} className="hover:bg-white/[0.03] transition-all cursor-pointer group">
                  <td className="p-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center font-black text-xs group-hover:border-neon-green/50 transition-all shadow-inner">
                      {stock.symbol.split('.')[0]}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{stock.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-black">{stock.sector}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right font-mono font-bold text-white">
                    ${parseFloat(stock.lastPrice).toLocaleString()}
                  </td>
                  <td className={`p-6 text-center font-mono font-black ${parseFloat(stock.priceChangePercent) >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                    {parseFloat(stock.priceChangePercent) >= 0 ? '▲' : '▼'} %{stock.priceChangePercent}
                  </td>
                  <td className="p-6 text-right text-gray-500 font-mono text-xs">
                    {Math.floor(stock.quoteVolume / 1000).toLocaleString()}K
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2 justify-center">
                      <button className="btn-viewtrade group w-[50%] relative overflow-hidden">
												<div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
												<span className="relative z-10"> <i className='fas fa-eye mr-3'></i>Göz At</span>
											</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🍏 DETAY MODAL (Senin şık kartın borsa versiyonu) */}
      {seciliHisse && (
        <HisseDetayKart data={seciliHisse} onClose={() => setSeciliHisse(null)} />
      )}
    </div>
  );
};

const HisseDetayKart = ({ data, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
    <div className="bg-[#0d0f11] border border-white/10 w-full max-w-2xl rounded-[40px] p-10 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
      <div className={`absolute -top-24 -right-24 w-80 h-80 blur-[120px] opacity-20 ${parseFloat(data.priceChangePercent) >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
      
      <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
        <i className="fas fa-times"></i>
      </button>

      <div className="mb-10">
        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
          {data.market} // {data.symbol}
        </span>
        <h2 className="text-6xl font-black text-white tracking-tighter mt-4 uppercase">
          {data.name}
        </h2>
        <div className="flex items-baseline gap-4 mt-2">
          <p className="text-4xl font-mono font-black text-white/90">${data.lastPrice}</p>
          <span className={`text-lg font-bold ${parseFloat(data.priceChangePercent) >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
             %{data.priceChangePercent}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Sektör</p>
          <p className="text-lg font-bold mt-1 text-white/80">{data.sector}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">İşlem Hacmi</p>
          <p className="text-lg font-mono font-bold mt-1 text-white/80">${(data.quoteVolume / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      <button className="w-full py-5 bg-neon-green hover:bg-neon-green/80 text-black font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
         Portföye Ekle
      </button>
    </div>
  </div>
);

export default StockMarketPage;