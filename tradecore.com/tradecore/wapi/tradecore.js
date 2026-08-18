const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const sirketListeleRoute = require('./ISLEMLER/sirket_islemleri');
const kullaniciIslemleriRouter = require('./ISLEMLER/kullanici_islemleri');
const bakiyeBilgileriRouter = require('./ISLEMLER/bakiye_bilgileri');
const coinIslemleriRouter = require('./ISLEMLER/coin_listesi');
const kullaniciVarlikIslemleriRouter = require('./ISLEMLER/kullanici_varlik_islemleri.js');
const pdfIslemleriRouter = require('./ISLEMLER/pdf_islemleri.js');

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = 'https://lgqpaeqlwhbhswmvhmrr.supabase.co';
const supabaseAnonKey = 'sb_secret_VIl3odvjEANGscirPCcEag_TT0Nyhqs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// örnek kullanım yönelgesi
// GET    -> {baseUrl/}{islemHeader}/Listele
// POST   -> {baseUrl/}{islemHeader}/Ekle
// PUT    -> {baseUrl/}{islemHeader}/Duzenle/:id
// DELETE -> {baseUrl/}{islemHeader}/Sil/:id

app.use('/KullaniciListesi', kullaniciIslemleriRouter(supabase));
app.use('/BakiyeBilgileri', bakiyeBilgileriRouter(supabase));
app.get('/SirketBilgileri', sirketListeleRoute(supabase));
app.use('/CoinBilgileri', coinIslemleriRouter(supabase));
app.use('/kullaniciVarlikIslemleri', kullaniciVarlikIslemleriRouter(supabase));
app.use('/pdfIslemleri', pdfIslemleriRouter(supabase));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Tradecore WAPI Başlatıldı. Port: ${PORT}`);
});
