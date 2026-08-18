const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const sirketListeleRoute = require('./ISLEMLER/sirket_islemleri');
const kullaniciIslemleriRouter = require('./ISLEMLER/kullanici_islemleri');
const bakiyeBilgileriRouter = require('./ISLEMLER/bakiye_bilgileri');
const coinIslemleriRouter = require('./ISLEMLER/coin_listesi');

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = 'https://lgqpaeqlwhbhswmvhmrr.supabase.co';
const supabaseAnonKey = 'sb_secret_VIl3odvjEANGscirPCcEag_TT0Nyhqs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


// İstediğin action-based yapı:
// GET    -> http://localhost:3000/KullaniciListesi/Listele
// POST   -> http://localhost:3000/KullaniciListesi/Ekle
// PUT    -> http://localhost:3000/KullaniciListesi/Duzenle/:id
// DELETE -> http://localhost:3000/KullaniciListesi/Sil/:id

app.use('/KullaniciListesi', kullaniciIslemleriRouter(supabase));
app.use('/BakiyeBilgileri', bakiyeBilgileriRouter(supabase));
app.get('/SirketBilgileri', sirketListeleRoute(supabase));
app.use('/CoinBilgileri', coinIslemleriRouter(supabase));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Tradecore WAPI Başlatıldı. Port: ${PORT}`);
});
