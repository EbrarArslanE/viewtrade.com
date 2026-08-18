const express = require('express');
const router = express.Router();

function coinIslemleri(supabase) {

  // 1. LİSTELE [L] -> /KullaniciListesi/Listele
  router.get('/Listele', async (req, res) => {
    try {
      console.log('[L] İşlem Tipi: Coinler Listeleniyor...');
      const { data, error } = await supabase.from('COIN_LISTESI').select('*');
      if (error) throw error;
      res.json({ islemTag: 'L', success: true, count: data.length, data });
    } catch (err) {
      res.status(500).json({ islemTag: 'L', success: false, error: err.message });
    }
  });

  // 2. EKLE [E] -> /KullaniciListesi/Ekle
  router.post('/Ekle', async (req, res) => {
    try {
      console.log('[E] İşlem Tipi: Yeni Coin Ekleniyor...');
      const yeniVeri = req.body;

      const { data, error } = await supabase
        .from('COIN_LISTESI')
        .insert([yeniVeri])
        .select();

      if (error) throw error;
      res.status(201).json({ islemTag: 'E', success: true, message: 'Kayıt başarıyla eklendi!', data: data[0] });
    } catch (err) {
      res.status(500).json({ islemTag: 'E', success: false, error: err.message });
    }
  });

  // 3. DÜZENLE [D] -> /KullaniciListesi/Duzenle/:id
  router.put('/Duzenle/:id', async (req, res) => {
    try {
      console.log('[D] İşlem Tipi: Coin Güncelleniyor...');
      const { id } = req.params;
      const guncelVeri = req.body;

      const { data, error } = await supabase
        .from('COIN_LISTESI')
        .update(guncelVeri)
        .eq('e_id', id)
        .select();

      if (error) throw error;
      res.json({ islemTag: 'D', success: true, message: 'Kayıt güncellendi!', data: data[0] });
    } catch (err) {
      res.status(500).json({ islemTag: 'D', success: false, error: err.message });
    }
  });

  // 4. SİL [S] -> /KullaniciListesi/Sil/:id
  router.delete('/Sil/:id', async (req, res) => {
    try {
      console.log('[S] İşlem Tipi: Coin Siliniyor...');
      const { id } = req.params;

      const { error } = await supabase
        .from('COIN_LISTESI')
        .delete()
        .eq('e_id', id);

      if (error) throw error;
      res.json({ islemTag: 'S', success: true, message: 'Coin sistemden silindi!' });
    } catch (err) {
      res.status(500).json({ islemTag: 'S', success: false, error: err.message });
    }
  });

  return router;
}

module.exports = coinIslemleri;
