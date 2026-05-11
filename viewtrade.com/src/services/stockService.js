import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5001;

// 🍏 CORS STRATEJİSİ: En temiz ve hata payı olmayan hali bu kanka.
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/**
 * 🍏 VIEWTRADE CORE: Veri Kaynağı
 * Resimdeki taptaze key'i buraya kilitledik.
 */
const FINNHUB_API_KEY = 'd8140k9r01qler4gubrgd8140k9r01qler4gubs0';

// Takip edilecek devler (İstediğini ekle kanka, yapı sağlam)
const DEFAULT_SYMBOLS = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META'];

app.get('/api/stocks/defaults', async (req, res) => {
    try {
        console.log("📈 Borsa verileri çekiliyor...");

        const requests = DEFAULT_SYMBOLS.map(symbol =>
            axios.get(`https://finnhub.io/api/v1/quote`, {
                params: {
                    symbol: symbol,
                    token: FINNHUB_API_KEY
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 8000 // Finnhub bazen geç cevap verebilir, süreyi artırdık
            })
        );

        const responses = await Promise.all(requests);

        const data = responses.map((response, index) => {
            const d = response.data;
            // Finnhub bazen 200 döner ama içi boş olur, onu burada yakalıyoruz
            if (!d.c) {
                console.warn(`⚠️ ${DEFAULT_SYMBOLS[index]} için veri boş geldi. Key limitli olabilir.`);
            }
            return {
                symbol: DEFAULT_SYMBOLS[index],
                price: d.c || 0,
                change: d.d || 0,
                percentChange: d.dp || 0,
                high: d.h || 0,
                low: d.l || 0,
                open: d.o || 0,
                prevClose: d.pc || 0
            };
        });

        console.log("✅ Veriler başarıyla hazırlandı.");
        res.json(data);

    } catch (error) {
        // 🍎 HATA LABORATUVARI: Terminalde her şeyi açık açık görelim
        const status = error.response ? error.response.status : 500;
        const errorData = error.response ? error.response.data : error.message;

        console.error(`❌ PATLADIK KANKA! | Kod: ${status}`);
        console.error(`📝 Detay:`, errorData);

        res.status(status).json({
            error: 'Borsa motoru su kaynattı.',
            message: error.message,
            debug: errorData
        });
    }
});

// Sunucuyu ateşle
app.listen(PORT, () => {
    console.log(`\n====================================================`);
    console.log(`🚀 VIEWTRADE BACKEND AKTİF | PORT: ${PORT}`);
    console.log(`🍏 MOD: Professional Developer & Street Smarts`);
    console.log(`🍷 DURUM: Şarap ve Motive Eşliğinde Kodlanmıştır.`);
    console.log(`🔗 TEST ET: http://localhost:${PORT}/api/stocks/defaults`);
    console.log(`====================================================\n`);
});
