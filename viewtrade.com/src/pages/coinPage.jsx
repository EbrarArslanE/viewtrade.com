import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom'; // URL parametreleri için şart
import axios from 'axios';

const TradingViewChart = ({ coin }) => {
  const container = useRef();

  useEffect(() => {
    if (!container.current || !coin) return;
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": `BINANCE:${coin.replace('USDT', '')}USDT`, // Formatı sağlama aldık
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

function CoinDetailPage() {
  const { symbol } = useParams(); // 🍏 1. ADIM: URL'den sembolü yakalıyoruz
  const [loading, setLoading] = useState(true);
  const [seciliCoin, setSeciliCoin] = useState(null);
  const [coins, setCoins] = useState([]);

  // Market verilerini çekme
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
        const filterCoins = response.data
          .filter(c => c.symbol.endsWith('USDT'))
          .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));
        
        setCoins(filterCoins);

        // 🍏 2. ADIM: URL'deki sembole göre veriyi bul
        // Eğer URL'de sembol varsa (örn: BTCUSDT), onu bul. Yoksa ilkini seç.
        const currentSymbol = symbol ? (symbol.endsWith('USDT') ? symbol : `${symbol}USDT`) : 'BTCUSDT';
        const guncelVeri = filterCoins.find(c => c.symbol === currentSymbol);
        
        if (guncelVeri) {
          setSeciliCoin(guncelVeri);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Market verisi çekilemedi:", error);
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, [symbol]); // Symbol değiştiğinde (yeni arama) tekrar çalışır

  if (loading || !seciliCoin) {
    return <div className="min-h-screen bg-[#020617]/50 flex items-center justify-center text-neon-green font-mono">VERİLER YÜKLENİYOR...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-cyber-tech selection:bg-neon-green selection:text-black bg-[#020617]/50 text-white">
      <div className="grid grid-cols-12 gap-6">
        
        {/* Grafik Alanı */}
        <div className="col-span-12 xl:col-span-8 group relative bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-3xl overflow-hidden hover:border-neon-green/30 transition-colors">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                <h2 className="text-2xl font-bold italic tracking-tight">{seciliCoin.symbol}</h2>
              </div>
              <p className="text-xs text-gray-500 font-mono tracking-widest">Canlı Piyasa Verisi</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-mono font-bold text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                ${parseFloat(seciliCoin.lastPrice).toLocaleString()}
              </p>
              <p className={`text-sm font-bold font-mono ${parseFloat(seciliCoin.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {parseFloat(seciliCoin.priceChangePercent) >= 0 ? '▲' : '▼'} {seciliCoin.priceChangePercent}%
              </p>
            </div>
          </div>

          <div className="h-[600px] w-full rounded-3xl border border-white/5 bg-black/40 relative overflow-hidden">
             {/* 🍏 Grafik bileşenine temiz sembolü gönderiyoruz */}
            <TradingViewChart coin={seciliCoin.symbol} />
          </div>
        </div>

        {/* Sağ Panel */}
        <div className="col-span-12 xl:col-span-4 h-[500px] space-y-6">
          <div className="bg-gradient-to-br from-neon-green/10 to-transparent border border-neon-green/20 rounded-3xl p-6">
            <p className="text-[12px] font-mono text-neon-green mb-4 opacity-70 tracking-tighter">İstatistikler ({seciliCoin.symbol})</p>
              
            <div className="flex flex-col gap-3 mb-6">
              <StatRow label="24s Değişim" value={seciliCoin.priceChange} color="text-white" />
              <StatRow label="En Yüksek" value={seciliCoin.highPrice} color="text-emerald-400" />
              <StatRow label="En Düşük" value={seciliCoin.lowPrice} color="text-red-400" />
              <StatRow label="Hacim (USDT)" value={parseFloat(seciliCoin.quoteVolume).toFixed(0)} color="text-blue-400" />
              <StatRow label="İşlem Sayısı" value={seciliCoin.count} color="text-white" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-start gap-3">
                <span>Coin Sembolü: {seciliCoin.symbol}</span>
                <span>Alış Fiyatı (En Düşük): {seciliCoin.askPrice}</span>
              </div>

              <div className="flex items-center">
                <div className="text-[#f4f4f5] px-4 py-3 bg-[#1a1d1e] rounded-l-lg border-y border-r border-white/10">
                  {seciliCoin.symbol}
                </div>
                <input className="input w-full bg-[#1a1d1e] text-[#f4f4f5] px-3 py-3 border border-white/10 focus:outline-none focus:ring-1 focus:ring-neon-green transition-all" placeholder="Almak İstediğiniz Tutar" />
                <div className="text-[#f4f4f5] px-4 py-3 bg-[#1a1d1e] rounded-r-lg border-y border-r border-white/10">
                  <i className='fas fa-dollar-sign'></i>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 bg-neon-green text-white font-black rounded-1 hover:brightness-110 active:scale-95 transition-all text-xs tracking-widest">
                  <i className="fas fa-plus-circle mr-2"></i>Al
                </button>
                <button className="py-4 bg-neon-green text-white font-black rounded-1 hover:brightness-110 active:scale-95 transition-all text-xs tracking-widest">
                  <i className="fas fa-minus-circle mr-2"></i>Sat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Yardımcı Satır Bileşeni
const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-2">
    <span className="text-xs text-gray-400 font-mono">{label}:</span>
    <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
  </div>
);

export default CoinDetailPage;