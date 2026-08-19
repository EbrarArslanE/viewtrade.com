const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const sirketListeleRoute              = require('./ISLEMLER/sirket_islemleri');
const kullaniciIslemleriRouter        = require('./ISLEMLER/kullanici_islemleri');
const bakiyeBilgileriRouter           = require('./ISLEMLER/bakiye_bilgileri');
const coinIslemleriRouter             = require('./ISLEMLER/coin_listesi');
const kullaniciVarlikIslemleriRouter  = require('./ISLEMLER/kullanici_varlik_islemleri.js');
const pdfIslemleriRouter              = require('./ISLEMLER/pdf_islemleri.js');
const firmaIslemleriRouter             = require('./ISLEMLER/firma_islemleri.js');

const app = express();
app.use(express.json());
app.use(cors());

function readEnvFile(envFilePath) {
  try {
    const envContent = fs.readFileSync(envFilePath, 'utf8');
    return envContent.split(/\r?\n/).reduce((accumulator, line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return accumulator;
      }

      const equalIndex = trimmedLine.indexOf('=');

      if (equalIndex === -1) {
        return accumulator;
      }

      const key = trimmedLine.slice(0, equalIndex).trim();
      const value = trimmedLine.slice(equalIndex + 1).trim();
      accumulator[key] = value;
      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

const repoEnv = readEnvFile(path.resolve(__dirname, '..', '..', '.env'));
const supabaseUrl = process.env.SUPABASE_URL || repoEnv.SUPABASE_URL || 'https://lgqpaeqlwhbhswmvhmrr.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY || repoEnv.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_mazJD1fxNZYKLwkfYB0srA_rCc3UaYP';
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
app.use('/FirmaListesi', firmaIslemleriRouter(supabase));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Tradecore WAPI Başlatıldı. Port: ${PORT}`);
});
