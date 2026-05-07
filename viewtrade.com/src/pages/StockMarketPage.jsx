import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockMarketPage = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Binance Public API - Proxy gerektirmez, direkt akar
        const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
        // Sadece USDT paritelerini ve popüler olanları filtreleyelim
        const filterCoins = response.data
          .filter(c => c.symbol.endsWith('USDT'))
          .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
          .slice(0, 50); // İlk 50 coin
        
        setCoins(filterCoins);
        setLoading(false);
      } catch (error) {
        console.error("Market verisi çekilemedi Cimi:", error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 10000); // 10 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#2A3335] text-white pt-10 pb-20 px-8">
      {/* 🍏 Market Header & Stats */}
      <div className="max-w-[1600px] mx-auto mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">Coin Piyasası</h1>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Real-time Global Crypto Stream</p>
        
        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Öne Çıkan İstatistik Kutuları */}
          <div className="col-span-12 md:col-span-4 bg-[#111315] border border-white/5 p-6 rounded-[24px]">
             <span className="text-[10px] text-gray-500 font-black uppercase">En Çok Yükselen (24h)</span>
             <h2 className="text-2xl font-black text-emerald-400 mt-2">SOL/USDT</h2>
          </div>
          <div className="col-span-12 md:col-span-4 bg-[#111315] border border-white/5 p-6 rounded-[24px]">
             <span className="text-[10px] text-gray-500 font-black uppercase">Piyasa Hacmi</span>
             <h2 className="text-2xl font-black text-white mt-2">$2.41T</h2>
          </div>
          <div className="col-span-12 md:col-span-4 bg-neon-green/10 border border-neon-green/30 p-6 rounded-[24px]">
             <span className="text-[10px] text-neon-green font-black uppercase">Kuantum Sinyali</span>
             <h2 className="text-2xl font-black text-white mt-2 font-mono uppercase tracking-tighter text-neon-green">Bullish Focus</h2>
          </div>
        </div>
      </div>

      {/* 🍏 Market Table */}
      <div className="max-w-[1600px] mx-auto bg-[#111315]/50 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Varlık</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Son Fiyat</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">24s Değişim</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">24s Hacim</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-20 text-center font-mono text-neon-green animate-pulse">STREAMING_MARKET_DATA...</td></tr>
            ) : (
              coins.map((coin) => (
                <tr key={coin.symbol} className="border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center font-black text-[10px] group-hover:border-neon-green/50 transition-colors">
                        {coin.symbol.replace('USDT', '')}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{coin.symbol}</span>
                    </div>
                  </td>
                  <td className="p-6 font-mono text-sm font-bold">
                    ${parseFloat(coin.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`p-6 text-center font-mono text-xs font-black ${parseFloat(coin.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {parseFloat(coin.priceChangePercent) >= 0 ? '▲' : '▼'} {coin.priceChangePercent}%
                  </td>
                  <td className="p-6 text-right font-mono text-xs text-gray-400">
                    {Math.floor(parseFloat(coin.quoteVolume)).toLocaleString()} USDT
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockMarketPage;