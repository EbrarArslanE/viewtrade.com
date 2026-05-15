import React, { useState, useEffect } from 'react';
import { fetchMassiveData } from '../services/newsService'; // Kendi servisine göre açarsın

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

const FinanceNewsPage = () => {
  const [massiveItems, setMassiveItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simüle edilmiş veri çekimi (Sen kendi servisini bağlarsın)
    const getMassiveContent = async () => {
      const result = await fetchMassiveData();
      setMassiveItems(result.items); 
      setLoading(false);
    };
    getMassiveContent();
  }, []);
		
	const formatDate = (dateString) => {
		if (!dateString) return "-";
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('tr-TR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(date);
	};

  return (
    <div className="w-full h-[80%] gap-1 flex flex-col bg-[#1a1d1e] text-white pt-10 pb-20 px-8">
      <div className="grid grid-cols-12 gap-6 h-[100%] w-full mx-auto">

        <div className="col-span-12 lg:col-span-12 bg-[#111315] h-[100%] border border-[#2A3335] rounded-[12px] p-8 overflow-hidden">
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
                        {formatDate(item.ex_dividend_date)}
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

			<div className='w-full flex flex-row items-center justify-center bg-[#111315] rounded-[12px] border-t border-white/5 py-3 px-8'>
				
				{/* Sol Ok - Kare Buton */}
				<button className="group relative w-10 h-10 overflow-hidden flex items-center justify-center rounded-lg bg-[#1A1F21] border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
					{/* Shine Efekti */}
					<div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-500 ease-in-out"></div>
					<span className="relative z-10 text-gray-400 group-hover:text-emerald-400 transition-colors">
						<i className='fas fa-arrow-left text-xs'></i>
					</span>
				</button>

				{/* Pagination Text - Modern Terminal Font */}
				<div className="flex items-center flex-col gap-2 px-4">
					<div className="flex items-center flex-row gap-2 px-4">
						<span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">01</span>
						<span className="text-[10px] font-black tracking-[0.3em] text-gray-500">/ 12</span>
					</div>
					<span className="text-[10px] font-black tracking-[0.3em] text-gray-500">Sayfa</span>
				</div>

				{/* Sağ Ok - Kare Buton */}
				<button className="group relative w-10 h-10 overflow-hidden flex items-center justify-center rounded-lg bg-[#1A1F21] border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
					{/* Shine Efekti */}
					<div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-500 ease-in-out"></div>
					<span className="relative z-10 text-gray-400 group-hover:text-emerald-400 transition-colors">
						<i className='fas fa-arrow-right text-xs'></i>
					</span>
				</button>

			</div>
    </div>
  );
};

export default FinanceNewsPage;