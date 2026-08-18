const axios = require('axios'); // API istekleri için

// Canlı coin fiyatlarını çeken örnek fonksiyon (Binance API üzerinden)
async function guncelFiyatlariAl() {
  try {
    // Örnek: Binance'den anlık USDT bazlı fiyatları çekiyoruz
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
    const prices = {};

    response.data.forEach(item => {
      // Örn: "BTCUSDT" -> "btc": 65000 formatına çeviriyoruz
      const coinKey = 'e_' + item.symbol.replace('USDT', '').toLowerCase();
      prices[coinKey] = parseFloat(item.price);
    });

    return prices;
  } catch (err) {
    console.error("Fiyat çekme hatası:", err.message);
    return {};
  }
}

// Kullanıcının toplam bakiyesini hesaplayıp güncelleyen fonksiyon
async function kullaniciBakiyesiniGuncelle(supabase, kullaniciId) {
  try {
    // 1. Kullanıcının cüzdanındaki coinleri ve adetlerini çek
    const { data: cuzdan, error } = await supabase
      .from('KULLANICI_COIN_BILGILERI')
      .select(`
        e_adet,
        COIN_LISTESI ( e_coin_kodu )
      `)
      .eq('e_kullanici_id', kullaniciId);

    if (error || !cuzdan) throw error;

    // 2. Canlı piyasa fiyatlarını al
    const piyasaFiyatlari = await guncelFiyatlariAl();

    let toplamPortfoyDegeri = 0;

    // 3. Her coinin adet * güncel fiyat hesabını yap
    cuzdan.forEach(item => {
      const kod = item.COIN_LISTESI?.e_coin_kodu; // örn: "e_btc"
      const adet = item.e_adet || 0;

      const birimFiyat = piyasaFiyatlari[kod] || 0; // Eğer API'de yoksa 0 al
      toplamPortfoyDegeri += (adet * birimFiyat);
    });

    // 4. Hesaplanan toplam değeri KULLANICILAR tablosuna bas
    const { error: updateError } = await supabase
      .from('KULLANICILAR')
      .update({ e_bakiye: toplamPortfoyDegeri })
      .eq('e_id', kullaniciId);

    if (updateError) throw updateError;

    console.log(`[B] Kullanıcı ${kullaniciId} için bakiye güncellendi: $${toplamPortfoyDegeri.toFixed(2)}`);
    return toplamPortfoyDegeri;

  } catch (err) {
    console.error("Bakiye güncelleme hatası:", err.message);
  }
}
