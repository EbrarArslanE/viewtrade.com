import React, { useState, useEffect } from 'react';
// import { fetchMassiveData } from '../services/newsService'; // Kendi servisine göre açarsın

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
    // Simüle edilmiş veri çekimi (Sen kendi servisini bağlarsın)
    const getMassiveContent = async () => {
      // const result = await fetchMassiveData();
      // setMassiveItems(result.items.slice(0, 5)); 
      
      // Test verisi (Silersin burayı)
      setMassiveItems([
        { id: 1, ticker: "METCI", cash_amount: "2.50", currency: "USD", ex_dividend_date: "2026-05-10", dividend_type: "CD" },
        { id: 2, ticker: "AAPL", cash_amount: "0.24", currency: "USD", ex_dividend_date: "2026-05-12", dividend_type: "CD" },
        { id: 3, ticker: "MSFT", cash_amount: "1.10", currency: "USD", ex_dividend_date: "2026-05-15", dividend_type: "SD" },
      ]);
      setLoading(false);
    };
    getMassiveContent();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#2A3335] text-white pt-10 pb-20 px-8">
    {/* <div className="w-full min-h-screen bg-[#09090b] text-white pt-10 pb-20 px-8"> */}
      <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
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
        <div className="col-span-12 lg:col-span-9 bg-[#111315] border border-[#2A3335] rounded-[32px] p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[11px] font-bold text-gray-400 tracking-widest">GÜNCEL FİNANSAL BİLDİRİMLER</h2>
            <button className="text-[10px] text-[#73b2c0] hover:text-white transition-colors">Tümünü Gör</button>
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

        {/* 🍏 Resmi Sistem Bülten Kutusu */}
        <div className="col-span-12 lg:col-span-3 bg-[#73b2c0]/10 border border-[#73b2c0]/30 rounded-[32px] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="w-12 h-12 bg-[#73b2c0]/20 rounded-full flex items-center justify-center mb-4 text-[#73b2c0]">
            <i className="fas fa-shield-alt text-lg"></i>
          </div>
          <h3 className="font-bold text-[13px] text-white mb-2">Güvenli Veri Akışı</h3>
          <p className="text-[11px] text-gray-400 mb-6">Piyasa uyarılarını doğrudan sisteminize entegre edin.</p>
          <button className="w-full py-3 bg-[#73b2c0] text-[#09090b] text-[11px] font-black rounded-xl hover:bg-white transition-colors">
            Bağlantı Kur
          </button>
        </div>

      </div>
    </div>
  );
};

export default WelcomePage;