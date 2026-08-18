// wapi/LISTELER/sirket_bilgileri_listele.js
const express = require('express');
const router = express.Router();

// Şirket listeleme fonksiyonu [L]
function sirketleriListele(supabase) {
  return async (req, res) => {
    try {
      console.log('[L] İşlem Tipi: Şirket Listeleme çalıştırılıyor...');
      const { data, error } = await supabase.from('SIRKETLER').select('*');
      if (error) throw error;
      res.json({ islemTag: 'L', success: true, count: data.length, data: data });
    } catch (err) {
      console.error('[L] Hata:', err.message);
      res.status(500).json({ islemTag: 'L', success: false, error: err.message });
    }
  };
}

module.exports = sirketleriListele;
