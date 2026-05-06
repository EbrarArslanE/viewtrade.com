import React, { useState, useEffect } from 'react';
import { fetchMassiveData } from '../services/newsService';

const NewsBox = ({ title, source, time, category }) => (
  <div className="bg-[#111315]/60 backdrop-blur-md border border-white/5 p-5 rounded-3xl hover:border-neon-green/30 transition-all group cursor-pointer h-full flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
          {category}
        </span>
        <span className="text-[9px] text-gray-600 font-mono">{time}</span>
      </div>
      <h3 className="text-sm font-bold text-gray-300 group-hover:text-white leading-relaxed">
        {title}
      </h3>
    </div>
    <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-gray-500 font-black uppercase tracking-widest">
      Source: {source}
    </div>
  </div>
);

// 🍏 Yükselen Coinler Satırı
const GainerRow = ({ name, price, change }) => (
  <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-2xl transition-all group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-neon-green/10 rounded-lg border border-neon-green/20 flex items-center justify-center text-[10px] font-black text-neon-green">
        {name[0]}
      </div>
      <span className="text-xs font-bold tracking-widest">{name}/USDT</span>
    </div>
    <div className="text-right">
      <div className="text-xs font-mono text-white">${price}</div>
      <div className="text-[9px] font-bold text-emerald-400">+{change}%</div>
    </div>
  </div>
);
const WelcomePage = () => {
  const [massiveItems, setMassiveItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMassiveContent = async () => {
      const result = await fetchMassiveData();
      // Massive'den gelen veriyi state'e basıyoruz
      setMassiveItems(result.items.slice(0, 3)); // İlk 3 kutuyu doldur
      setLoading(false);
    };
    getMassiveContent();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white pt-10 pb-20 px-8">
      <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* 🍏 Üstteki o büyük fütüristik banner buraya */}
        <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-white/5 rounded-[40px] p-10 min-h-[400px] flex flex-col justify-end">
           <h1 className="text-4xl font-black tracking-tighter mb-4">Canlı Terminal Verileri Aktif.</h1>
           <p className="text-gray-400 text-sm">Massive API üzerinden gelen anlık sinyaller kutularda listeleniyor.</p>
        </div>

        {/* 🍏 Sağdaki Gainer Listesi buraya (Statik veya WebSocket) */}
        <div className="col-span-12 lg:col-span-4 bg-[#111315]/80 border border-white/10 rounded-[40px] p-8">
           <h2 className="text-[10px] font-black uppercase text-gray-500 mb-8">🔥 Trend Olanlar</h2>
           {/* GainerRow'ları buraya diziyoruz */}
        </div>

        {/* 🍏 ALT KUTULAR - MASSIVE'DEN GELEN CANLI VERİ */}
        {loading ? (
          <div className="col-span-12 text-center text-neon-green font-mono">Veri ağacı yükleniyor...</div>
        ) : (
          massiveItems.map((item) => (
            <div key={item.id} className="col-span-12 md:col-span-4 lg:col-span-3 min-h-[250px]">
							<NewsBox 
								key={item.id}
								category={item.ticker} // Başlıkta borsa kodu (METCI)
								title={`${item.cash_amount} ${item.currency} Temettü Ödemesi`} // Açıklama
								time={item.ex_dividend_date} // Tarih
								source={item.dividend_type === "CD" ? "Nakit Ödeme" : "Hisse Ödemesi"}
							/>
            </div>
          ))
        )}

        {/* Bülten Kutusu her zaman sonda */}
        <div className="col-span-12 md:col-span-12 lg:col-span-3 min-h-[250px] bg-neon-green rounded-3xl p-6 flex flex-col items-center justify-center text-black">
          <h3 className="font-black text-xs uppercase">Bültene Katıl</h3>
        </div>

      </div>
    </div>
  );
};

export default WelcomePage;