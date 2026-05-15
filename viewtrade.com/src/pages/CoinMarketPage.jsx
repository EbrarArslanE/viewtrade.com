import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoinMarketPage = () => {
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
          .slice(0, 20); // İlk 50 coin
        
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

	const [seciliCoin, setSeciliCoin] = React.useState(null);
	// console.log("seçilen coin", seciliCoin);
	
	const totalMarketVolume = coins.reduce((acc, coin) => acc + parseFloat(coin.quoteVolume), 0);
	
	const sortedByLoss = [...coins].sort((a, b) => 
			parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent)
	);

	const sortedByEarning = [...coins].sort((a, b) => 
			parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
	);

	const enCokArtan = sortedByEarning[0]?.symbol ? sortedByEarning[0].symbol.replace('USDT', '') : '---';
	const artisOrani = sortedByEarning[0]?.priceChangePercent || '0';

	const enCokAzalan = sortedByLoss[0]?.symbol ? sortedByLoss[0].symbol.replace('USDT', '') : '---';
	const azalisOrani = sortedByLoss[0]?.priceChangePercent || '0';

  return (
    <div className="w-full min-h-screen bg-[#1a1d1e] text-white pb-10 px-8">
      <div className="mx-auto mb-5">
        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Öne Çıkan İstatistik Kutuları */}
          <div className="col-span-12 md:col-span-4 bg-neon-green/10 border border-neon-green/30 p-6 rounded-[24px]">
             <span className="text-[10px] text-gray-500 font-black uppercase">Piyasa Hacmi</span>
             <h2 className="text-2xl font-black text-white mt-2">${(totalMarketVolume / 1000000).toFixed(2)}M</h2>
          </div>
          <div className="col-span-12 md:col-span-4 bg-neon-green/10 border border-neon-green/30 p-6 rounded-[24px]">
						<span className="text-[10px] text-gray-500 font-black uppercase">En Çok Yükselen (24h)</span>
             <h2 className="text-2xl font-black text-emerald-400 mt-2">{enCokArtan}  ▲{Math.abs(parseFloat(artisOrani)).toFixed(2)}</h2>
          </div>
          <div className="col-span-12 md:col-span-4 bg-neon-green/10 border border-neon-green/30 p-6 rounded-[24px]">
						<span className="text-[10px] text-gray-500 font-black uppercase">En Çok Azalan (24h)</span>
             <h2 className="text-2xl font-black text-red-400 mt-2">{enCokAzalan} ▼{Math.abs(parseFloat(azalisOrani)).toFixed(2)}</h2>
          </div>
        </div>
      </div>

			<div className="col-span-12 md:col-span-4 bg-[#1a1d1e]/80 backdrop-blur-xl border border-white/5 p-8 mb-5 rounded-[12px] shadow-2xl">
				<div className="flex flex-row flex-wrap gap-6">
					{/* 1. Fiyat Aralığı */}
					<div className="flex flex-col gap-2 w-[220px]">
						<label className="text-[11px] font-bold text-gray-500 tracking-tight ml-1">Fiyat Aralığı</label>
						<div className="relative group">
							<select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[12px] text-white font-mono outline-none appearance-none focus:border-neon-green/50 focus:bg-white/10 transition-all cursor-pointer">
								<option value="all" className="bg-[#111315]">Tüm Varlıklar</option>
								<option value="penny" className="bg-[#111315]">1 Dolar Altı</option>
								<option value="mid" className="bg-[#111315]">1 - 100 Dolar Arası</option>
								<option value="high" className="bg-[#111315]">100 Dolar Üstü</option>
							</select>
							<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-neon-green transition-colors">
								<i className="fas fa-chevron-down text-[10px]"></i>
							</div>
						</div>
					</div>

					{/* 2. Piyasa Hiyerarşisi */}
					<div className="flex flex-col gap-2 w-[220px]">
						<label className="text-[11px] font-bold text-gray-500 tracking-tight ml-1">Piyasa Hiyerarşisi</label>
						<div className="relative group">
							<select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[12px] text-white font-mono outline-none appearance-none focus:border-neon-green/50 focus:bg-white/10 transition-all cursor-pointer">
								<option value="all" className="bg-[#111315]">Varsayılan Sıralama</option>
								<option value="top" className="bg-[#111315]">En Yüksek Piyasa Değeri</option>
								<option value="bottom" className="bg-[#111315]">En Düşük Piyasa Değeri</option>
							</select>
							<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-neon-green transition-colors">
								<i className="fas fa-chevron-down text-[10px]"></i>
							</div>
						</div>
					</div>

					{/* 3. Piyasa Trendi */}
					<div className="flex flex-col gap-2 w-[220px]">
						<label className="text-[11px] font-bold text-gray-500 tracking-tight ml-1">Piyasa Trendi</label>
						<div className="relative group">
							<select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[12px] text-white font-mono outline-none appearance-none focus:border-neon-green/50 focus:bg-white/10 transition-all cursor-pointer">
								<option value="all" className="bg-[#111315]">Tüm Değişimler</option>
								<option value="bull" className="bg-[#111315]">Yükseliş Trendindekiler</option>
								<option value="bear" className="bg-[#111315]">Düşüş Trendindekiler</option>
								<option value="stable" className="bg-[#111315]">Stabil Seyredenler</option>
							</select>
							<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-neon-green transition-colors">
								<i className="fas fa-chevron-down text-[10px]"></i>
							</div>
						</div>
					</div>

					{/* 4. İşlem Hacmi */}
					<div className="flex flex-col gap-2 w-[220px]">
						<label className="text-[11px] font-bold text-gray-500 tracking-tight ml-1">İşlem Hacmi</label>
						<div className="relative group">
							<select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[12px] text-white font-mono outline-none appearance-none focus:border-neon-green/50 focus:bg-white/10 transition-all cursor-pointer">
								<option value="all" className="bg-[#111315]">Tüm Hacimler</option>
								<option value="whale" className="bg-[#111315]">Yüksek Hacimli Varlıklar</option>
								<option value="active" className="bg-[#111315]">Orta Segment Hacim</option>
								<option value="low" className="bg-[#111315]">Düşük İşlem Hacmi</option>
							</select>
							<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-neon-green transition-colors">
								<i className="fas fa-chevron-down text-[10px]"></i>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-2 w-[420px]">
						<label className="text-[11px] font-bold text-gray-500 tracking-tight ml-1">Arama</label>
						<div className="relative flex w-full">
							<input className="w-full bg-white/5 text-[12px] text-white font-mono px-4 py-2.5 rounded-l-xl border-y border-l border-white/10 outline-none focus:border-neon-green/40 focus:bg-white/10 transition-all" type="text" placeholder="Coin adı veya sembolü girin..." />
							<button className="px-5 bg-white/5 border border-white/10 rounded-r-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all active:scale-95">
								<i className='fas fa-search text-xs'></i>
							</button>
						</div>
					</div>

				</div>
			</div>

      {/* 🍏 Market Table */}
      <div className="overflow-y-auto max-h-[800px] mx-auto bg-[#111315]/50 backdrop-blur-xl border border-white/5 rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className='sticky sticky top-0 z-20 bg-[#292e2f]'>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-6 text-[12px] text-white text-gray-500 tracking-widest border-line-3 text-center">Sembol</th>
              <th className="p-6 text-[12px] text-white text-gray-500 tracking-widest border-line-3 text-center">Varlık</th>
              <th className="p-6 text-[12px] text-white text-gray-500 tracking-widest border-line-3 text-right">Son Fiyat</th>
              <th className="p-6 text-[12px] text-white text-gray-500 tracking-widest border-line-3 text-center">24 saatlik Değişim</th>
              <th className="p-6 text-[12px] text-white text-gray-500 tracking-widest border-line-3 text-center">24 saatlik Hacim</th>
              <th className="p-6 text-[12px] text-white text-gray-500 tracking-widest border-line-3 text-center">Hızlı İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className='text-center'>
								<td colSpan="6" className="p-20 text-center">
									<div className="flex flex-col items-center justify-center w-full py-10">
										{/* 🍏 Parliament Mavisi Dönen Yuvarlak */}
										<div className="relative w-16 h-16">
											{/* Arka plan halkası (Daha sönük bir mavi) */}
											<div className="absolute inset-0 border-4 border-[#003366]/20 rounded-full"></div>
											{/* Dönen parlak kısım */}
											<div className="absolute inset-0 border-4 border-t-[#003366] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
										</div>

										{/* Metinler */}
										<h2 className="text-white mt-6 font-black tracking-tighter text-xl">
											Bağlantı Kuruluyor...
										</h2>
										<p className="text-gray-500 font-mono text-[10px] tracking-[0.2em] mt-2">
											Veri akışı stabilize ediliyor
										</p>
									</div>
								</td>
							</tr>
            ) : (
              coins.map((coin) => (
                <tr key={coin.symbol} className="border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group">
                  <td className='p-4 border-line-3'>
										<div className="justify-center items-center flex">
											<div className="w-8 h-8 bg-white/5 rounded-lg border-white/10 border flex items-center justify-center font-black text-[10px] group-hover:border-neon-green/50 transition-colors">
												{coin.symbol.replace('USDT', '')}
											</div>
										</div>
									</td>
									<td className="p-4 border-line-3">
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-bold text-sm tracking-tight">{coin.symbol}</span>
                    </div>
                  </td>
                  <td className="text-right p-4 border-line-3  font-mono text-sm font-bold">
                    ${parseFloat(coin.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`p-4 border-line-3 text-center font-mono text-xs font-black ${parseFloat(coin.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {parseFloat(coin.priceChangePercent) >= 0 ? '▲' : '▼'} {coin.priceChangePercent}%
                  </td>
                  <td className="p-4 border-line-3 text-right  font-mono text-xs text-gray-400">
                    {Math.floor(parseFloat(coin.quoteVolume)).toLocaleString()} USDT
                  </td>
                  <td className="p-4 border-line-3 flex items-center  justify-center text-right font-mono text-xs text-gray-400">
										<div className="flex items-center  w-[80%] justify-center gap-3 ">
											<button key={coin} onClick={() => setSeciliCoin(coin)} className="btn-viewtrade group w-[100%] relative overflow-hidden">
												<div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
												<span className="relative z-10"> <i className='fas fa-eye mr-3'></i>Göz At</span>
											</button>

											{/* <button className="btn-viewtrade group w-[50%] relative overflow-hidden">
												<div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
												<span className="relative z-10"> <i className='fas fa-eye mr-3'></i>Satın Al</span>
											</button> */}
										</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
			<div className="relative"> {/* Kartın düzgün görünmesi için relative şart */}	
				{seciliCoin && (
					<CoinDetailCard data={seciliCoin} onClose={() => setSeciliCoin(null)} />
				)}
			</div>
    </div>
  );
};
	const CoinDetailCard = ({ data, onClose }) => {
		if (!data) return null;

		return (
			<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-md p-4">
				<div className="bg-[#0d0f11] border border-white/10 w-[80%] rounded-[40px] p-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
					
					{/* 🍏 Arka Plan Efektleri: Dinamik Neon Işık */}
					<div className={`absolute -top-20 -right-20 w-64 h-64 blur-[120px] opacity-20 ${parseFloat(data.priceChangePercent) >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
					<div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

					{/* Kapat Butonu (Daha şık bir daire içinde) */}
					<button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-50">
						<i className="fas fa-times"></i>
					</button>

					{/* Üst Bilgi: Badge ve Sembol */}
					<div className="relative z-10 mb-10">
						<div className="flex items-center gap-3 mb-4">
							<span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
								{data.symbol} / USDT
							</span>
							<span className={`text-[10px] font-bold ${parseFloat(data.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
								{parseFloat(data.priceChangePercent) >= 0 ? '▲' : '▼'} %{data.priceChangePercent}
							</span>
						</div>
						<h2 className="text-6xl font-black text-white tracking-tighter">
							{data.symbol.replace('USDT', '')}
						</h2>
						<div className="flex items-baseline gap-2 mt-2">
							<p className="text-3xl font-mono font-black text-white/90">
								${parseFloat(data.lastPrice).toLocaleString()}
							</p>
							<span className="text-gray-500 text-xs font-mono">Borsa Güncel</span>
						</div>
					</div>

					{/* 🍏 Fiyat Aralığı (Range Bar): Günün en düşüğü ile en yükseği arasındaki yer */}
					<div className="mb-10 relative z-10">
						<div className="flex justify-between text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">
							<span>Günün En Düşüğü</span>
							<span>Günün En Yükseği</span>
						</div>
						<div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex items-center px-0.5">
							<div 
								className="h-0.5 bg-neon-green rounded-full shadow-[0_0_10px_#ccff00]" 
								style={{ 
									width: `${((parseFloat(data.lastPrice) - parseFloat(data.lowPrice)) / (parseFloat(data.highPrice) - parseFloat(data.lowPrice))) * 100}%` 
								}}
							></div>
						</div>
						<div className="flex justify-between mt-2 font-mono text-xs font-bold text-white/60">
							<span>${parseFloat(data.lowPrice).toLocaleString()}</span>
							<span>${parseFloat(data.highPrice).toLocaleString()}</span>
						</div>
					</div>

					{/* Teknik Detay Grid: Türkçe Mealli */}
					<div className="grid grid-cols-2 gap-3 relative z-10">
						<div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl">
							<p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Parasal Hacim</p>
							<p className="text-lg font-mono font-bold mt-1 text-white/80">
								${(parseFloat(data.quoteVolume) / 1000000).toFixed(2)}M <span className="text-[10px] text-gray-500">USDT</span>
							</p>
						</div>
						<div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl">
							<p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">İşlem Sayısı</p>
							<p className="text-lg font-mono font-bold mt-1 text-white/80">
								{parseInt(data.count).toLocaleString()} <span className="text-[10px] text-gray-500">Emir</span>
							</p>
						</div>
						<div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl">
							<p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Alış Teklifi</p>
							<p className="text-lg font-mono font-bold mt-1 text-emerald-500/80">${parseFloat(data.bidPrice).toFixed(2)}</p>
						</div>
						<div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl">
							<p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Satış Teklifi</p>
							<p className="text-lg font-mono font-bold mt-1 text-red-500/80">${parseFloat(data.askPrice).toFixed(2)}</p>
						</div>
					</div>

					<button className="btn-viewtrade group w-full mt-10 relative overflow-hidden">
						<div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
						<span className="relative z-10"> <i className='fa fa-credit-card-alt mr-3'></i>Satın Al / Portföy'e ekle</span>
					</button>
				</div>
			</div>
		);
	};
export default CoinMarketPage;