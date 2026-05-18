import React, { useMemo, useState, useEffect } from 'react';
import { fetchNewsData } from '../services/newsService';

const LiveMarketTerminal = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNewsContent = async () => {
            try {
                const response = await fetchNewsData();
                // API'den dönen yapı nesne içindeyse (.items), değilse doğrudan array ise korur
                setNewsItems(response.items || response); 
            } catch (error) {
                console.error("Haber çekilirken hata oluştu kanka:", error);
            } finally {
                setLoading(false);
            }
        };
        getNewsContent();
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

  // Veriyi memoize ederek render performansını koruyoruz
  const renderedNews = useMemo(() => {
    if (!newsItems || newsItems.length === 0) return null;

    return newsItems.map((item) => {
      const insight = item.insights?.[0];
      const sentiment = insight?.sentiment || 'neutral';
      
      const sentimentStyles = {
        positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]',
        negative: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
        neutral: 'bg-slate-400/10 text-slate-300 border-slate-400/20'
      };

      return (
        <div 
          key={item.id} 
          className="border border-white/5 bg-white/[0.03] backdrop-blur-md rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10 flex flex-col gap-3 group"
        >
          {/* Üst Yayıncı Bilgisi */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              {item.publisher?.favicon_url && (
                <img src={item.publisher.favicon_url} alt="" className="w-4 h-4 rounded-sm" />
              )}
              <span className="font-medium">{item.publisher?.name || 'Unknown Source'}</span>
            </div>
            <span>{formatDate(item.published_utc)}</span>
          </div>

          {/* Orta İçerik Alanı */}
          <div className="flex gap-4 justify-between items-start">
            <div className="flex-1 flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-slate-100 leading-snug group-hover:text-cyan-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {item.description}
              </p>
            </div>
            {item.image_url && (
              <img 
                src={item.image_url} 
                alt="News" 
                className="w-16 h-16 object-cover rounded-lg border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity hidden sm:block" 
              />
            )}
          </div>

          {/* Alt Bar - Tickers ve AI Sentiment */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
            {/* Ticker Butonu */}
            <div className="flex gap-1">
              {item.tickers?.map(ticker => (
                <button 
                  key={ticker} 
                  className="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/20 font-mono transition-colors cursor-pointer"
                >
                  #{ticker}
                </button>
              ))}
            </div>

            {/* AI Sentiment Badge */}
            <div 
              title={insight?.sentiment_reasoning} 
              className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all cursor-help ${sentimentStyles[sentiment]}`}
            >
              AI: {sentiment === 'positive' ? '🍏 Bullish' : sentiment === 'negative' ? '🍎 Bearish' : 'Neutral'}
            </div>
          </div>
        </div>
      );
    });
  }, [newsItems]); // Burası düzeldi, artık state'e bağlı tetikleniyor.

  return (
    <div className="flex flex-col gap-4 w-full w-full p-4 bg-black/40 border border-white/5">      
      <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/5">
        {loading ? (
          <div className="text-white/70 text-xs p-4 text-center animate-pulse">
            Haber terminali senkronize ediliyor kanka, beklemede kal...
          </div>
        ) : (
          renderedNews || (
            <div className="text-slate-500 text-xs p-4 text-center">
              Gösterilecek haber veya sinyal bulunamadı.
            </div>
          )
        )}				
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

export default LiveMarketTerminal;