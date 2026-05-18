import React, { useState, useEffect } from 'react';
import { fetchMassiveData } from '../services/newsService'; // Kendi servisine göre açarsın
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// 🍏 Kompakt ve Resmi Trend Satırı (Mini Tablo Formatı)
const GainerRow = ({ name, price, change, isUp }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/[0.02] hover:bg-white/[0.02] px-2 rounded-lg transition-all group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
      <span className="text-[12px] font-bold text-gray-200 tracking-tight">{name}/USDT</span>
    </div>
    <div className="text-right flex flex-col items-end">
      <div className="text-[12px] font-mono text-white">${price}</div>
      <div className={`text-[10px] font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {isUp ? '+' : ''}{change}%
      </div>
    </div>
  </div>
);

const WelcomePage = () => {
  const [massiveItems, setMassiveItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMassiveContent = async () => {
      const result = await fetchMassiveData();
      setMassiveItems(result.items.slice(0, 5)); 
      setLoading(false);
    };
    getMassiveContent();
  }, []);

  return (
    
    <div className="w-full min-h-screen gap-6 flex flex-col bg-[#1a1d1e] text-white pt-10 pb-20 px-8">
    
      <div className="relative w-full min-h-screen flex flex-col gap-16 bg-gradient-to-br from-[#020617] via-[#0B1120] to-[#071E3D] text-slate-100 pt-16 pb-20 px-10 selection:bg-cyan-500/30 overflow-x-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="flex items-center gap-3 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400">Live Market Feed Active</span>
          </div>

          <h1 className="group text-7xl md:text-9xl font-black tracking-tighter cursor-pointer transition-all duration-500">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-[length:200%_auto] hover:animate-gradient-x transition-all">
              viewtrade
            </span>
            <span className="relative inline-block text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-emerald-400">
              .com
              <span className="absolute bottom-2 left-0 w-0 h-1 bg-emerald-400 transition-all duration-500 group-hover:w-full shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
            </span>
          </h1>
          
          <p className="max-w-2xl text-slate-400 font-light text-xl leading-relaxed">
            Gerçek zamanlı verilerle borsa deneyimini <span className="text-white font-medium italic">risksiz</span> keşfet. 
            Stratejini geliştir, piyasayı domine et.
          </p>

          {/* CTA Butonları */}
          <div className="flex gap-4 mt-4">
            <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#020617] font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95">
              Simülasyona Başla
            </button>
            <button className="px-8 py-4 border border-slate-700 hover:border-slate-500 bg-white/5 backdrop-blur-sm rounded-xl transition-all hover:bg-white/10 active:scale-95">
              Nasıl Çalışır?
            </button>
          </div>
        </div>

        {/* 2. STATS GRID: Canlı Veri Görünümü (Scrollable Başlangıcı) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {[
            { label: 'Aktif Kullanıcı', val: '12.4k+', color: 'from-emerald-500/20' },
            { label: 'Simüle Edilen Hacim', val: '$1.2B', color: 'from-blue-500/20' },
            { label: 'Bağlı API', val: 'Binance & BIST', color: 'from-cyan-500/20' }
          ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl border border-white/5 bg-gradient-to-br ${stat.color} to-transparent backdrop-blur-md hover:border-white/20 transition-all cursor-crosshair group`}>
              <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold group-hover:text-white transition-colors">{stat.val}</h3>
            </div>
          ))}
        </div>

        {/* 3. SCROLL INDICATOR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-emerald-500 to-transparent animate-bounce" />
        </div>

      </div>
      
      <hr class="border-none h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent shadow-[0_0_8px_rgba(52,211,153,0.2)] my-8" />

      <div className="grid grid-cols-12 gap-6 w-full mx-auto">
        
        {/* 🍏 Üstteki Fütüristik ve Resmi Banner */}
        <div className="col-span-12 lg:col-span-8 bg-[#111315] border border-[#2A3335] rounded-[32px] p-10 min-h-[380px] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#73b2c0]/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#73b2c0]/10 border border-[#73b2c0]/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#73b2c0] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-[#73b2c0] tracking-widest">SİSTEM ÇEVRİMİÇİ</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white/90">Kuantum Terminal Veri Ağı.</h1>
            <p className="text-gray-400 text-[13px] max-w-lg leading-relaxed">
              Küresel piyasa sinyalleri, temettü bildirimleri ve anlık varlık hareketleri Massive API üzerinden senkronize edilmektedir.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-black text-[11px] font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Piyasa Özeti
            </button>
            <button className="px-6 py-3 bg-[#1A1F21] border border-[#2A3335] text-white text-[11px] font-bold rounded-xl hover:border-[#73b2c0]/50 transition-colors">
              Raporları Dışa Aktar
            </button>
          </div>
        </div>

        {/* 🍏 Sağdaki Trend Listesi */}
        <div className="col-span-12 lg:col-span-4 bg-[#111315] border border-[#2A3335] rounded-[32px] p-8">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-[11px] font-bold text-gray-400 tracking-widest">PİYASA TRENDLERİ</h2>
             <i className="fas fa-chart-line text-[#73b2c0]"></i>
           </div>
           <div className="flex flex-col">
             <GainerRow name="BTC" price="64,230.00" change="2.4" isUp={true} />
             <GainerRow name="ETH" price="3,450.10" change="1.8" isUp={true} />
             <GainerRow name="SOL" price="142.05" change="-0.5" isUp={false} />
             <GainerRow name="AVAX" price="34.20" change="4.2" isUp={true} />
           </div>
        </div>

        {/* 🍏 ALT KISIM - HABERLER YERİNE RESMİ SİNYAL TABLOSU */}
        <div className="col-span-12 lg:col-span-12 bg-[#111315] border border-[#2A3335] rounded-[32px] p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[11px] font-bold text-gray-400 tracking-widest">GÜNCEL FİNANSAL BİLDİRİMLER</h2>
                <Link to="/news/finance" className="no-underline text-white block px-4 py-2 hover:bg-emerald-500/10 hover:text-emerald-400">
                  {/* <i className="fas fa-cog text-[8px] mr-2"></i> Ayarlar */}
                  <button className="text-[10px] text-[#73b2c0] hover:text-white transition-colors">Tümünü Gör</button>
                </Link>
          </div>
          
          {loading ? (
            <div className="w-full py-10 flex justify-center items-center">
              <span className="text-[#73b2c0] font-mono text-sm animate-pulse">Veri blokları işleniyor...</span>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2A3335]">
                    <th className="pb-3 px-2 text-[10px] font-bold text-gray-500">Varlık Kodu</th>
                    <th className="pb-3 px-2 text-[10px] font-bold text-gray-500">Açıklama / İşlem</th>
                    <th className="pb-3 px-2 text-[10px] font-bold text-gray-500">Tarih</th>
                    <th className="pb-3 px-2 text-[10px] font-bold text-gray-500 text-right">Dağıtım Tipi</th>
                  </tr>
                </thead>
                <tbody>
                  {massiveItems.map((item, index) => (
                    <tr key={index} className="border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
                      <td className="py-4 px-2">
                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/[0.02] border border-white/5 rounded-md">
                          <span className="text-[12px] font-bold text-[#73b2c0]">{item.ticker}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-[12px] text-gray-300">
                        {item.cash_amount} {item.currency} Tutarında Temettü Ödemesi
                      </td>
                      <td className="py-4 px-2 text-[12px] text-gray-500 font-mono italic">
                        {item.ex_dividend_date}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span className="text-[10px] font-bold text-gray-400 bg-[#1A1F21] px-3 py-1.5 rounded-lg border border-[#2A3335]">
                          {item.dividend_type === "CD" ? "Nakit Ödeme" : "Hisse Dağıtımı"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;