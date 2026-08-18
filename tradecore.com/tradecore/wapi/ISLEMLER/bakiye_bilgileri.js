const express = require('express');
const router = express.Router();

function bakiyeBilgileri(supabase) {
  router.get('/Listele/:e_kullanici_id', async (req, res) => {
    try {
      const { e_kullanici_id } = req.params;

      console.log(`[B] Kullanıcının cüzdanı sorgulanıyor: ${e_kullanici_id}`);

      // 1. Önce kullanıcının coin cüzdan kayıtlarını çekelim
      let { data: cuzdanData, error: cuzdanError } = await supabase
        .from('KULLANICI_COIN_BILGILERI')
        .select('*')
        .eq('e_kullanici_id', e_kullanici_id);

      if (cuzdanError) throw cuzdanError;

      // Fallback (e_id ile arama)
      if (!cuzdanData || cuzdanData.length === 0) {
        const fallback = await supabase
          .from('KULLANICI_COIN_BILGILERI')
          .select('*')
          .eq('e_id', e_kullanici_id);

        cuzdanData = fallback.data;
        if (fallback.error) throw fallback.error;
      }

      if (!cuzdanData || cuzdanData.length === 0) {
        return res.status(404).json({
          islemTag: 'B',
          success: false,
          error: 'Bu kullanıcı için cüzdan / bakiye kaydı bulunamadı',
        });
      }

      // 2. Tüm coin listesini çekip mapleyelim (Join hatasını 0'a indiriyoruz)
      const { data: coinListesi, error: coinError } = await supabase
        .from('COIN_LISTESI')
        .select('*');

      if (coinError) throw coinError;

      // Coinleri hızlı aramak için sözlük (dictionary) yapısına çevirelim
      const coinMap = {};
      coinListesi.forEach(coin => {
        coinMap[coin.e_coin_id] = coin; // veya coin.id tablodaki PK neyse
      });

      // 3. Binance'den canlı fiyatları çekelim
      let toplamPortfoyDegeri = 0;
      const fiyatlar = {};

      try {
        const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price');
        const pricesData = await priceRes.json();

        pricesData.forEach(item => {
          const key = 'e_' + item.symbol.replace('USDT', '').toLowerCase();
          fiyatlar[key] = parseFloat(item.price);
        });
      } catch (priceErr) {
        console.warn("[B] Canlı fiyat çekilemedi:", priceErr.message);
      }

      // 4. Cüzdandaki verilerle coin detaylarını birleştirip portföyü hesaplayalım
      const birlesmisVeri = cuzdanData.map(item => {
        // İlgili coinin detaylarını bul
        const coinDetay = coinMap[item.e_coin_id] || {};
        const coinKod = coinDetay.e_coin_kodu; // Veritabanındaki sütun adın
        const adet = item.e_adet || 0;

        const birimFiyat = fiyatlar[coinKod] || 0;
        toplamPortfoyDegeri += (adet * birimFiyat);

        return {
          ...item,
          COIN_LISTESI: {
            e_coin_kodu: coinDetay.e_coin_kodu,
            e_coin_adi: coinDetay.e_coin_adi
          }
        };
      });

      // 5. Toplam portföy değerini KULLANICILAR tablosuna yazalım
      await supabase
        .from('KULLANICILAR')
        .update({ e_bakiye: toplamPortfoyDegeri })
        .eq('e_id', e_kullanici_id);

      // 6. Sonucu frontend'e fırlat
      res.json({
        islemTag: 'B',
        success: true,
        toplamBakiye: toplamPortfoyDegeri,
        data: birlesmisVeri,
      });

    } catch (err) {
      res.status(500).json({
        islemTag: 'B',
        success: false,
        error: err.message,
      });
    }
  });

  return router;
}

module.exports = bakiyeBilgileri;
