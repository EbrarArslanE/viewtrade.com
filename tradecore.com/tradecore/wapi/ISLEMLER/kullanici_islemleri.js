const express = require('express');
const router = express.Router();

function kullaniciIslemleri(supabase) {

  // 1. LİSTELE [L] -> /KullaniciListesi/Listele
  router.get('/Listele', async (req, res) => {
    try {
      console.log('[L] İşlem Tipi: Kullanıcılar Listeleniyor...');
      const { data, error } = await supabase.from('KULLANICILAR').select('*');
      if (error) throw error;
      res.json({ islemTag: 'L', success: true, count: data.length, data });
    } catch (err) {
      res.status(500).json({ islemTag: 'L', success: false, error: err.message });
    }
  });

  // 2. EKLE [E] -> /KullaniciListesi/Ekle
  router.post('/Ekle', async (req, res) => {
    try {
      console.log('[E] İşlem Tipi: Yeni Kullanıcı Ekleniyor...');
      const yeniVeri = req.body;

      const { data, error } = await supabase
        .from('KULLANICILAR')
        .insert([yeniVeri])
        .select();

      if (error) throw error;
      res.status(201).json({ islemTag: 'E', success: true, message: 'Kayıt başarıyla çakıldı!', data: data[0] });
    } catch (err) {
      res.status(500).json({ islemTag: 'E', success: false, error: err.message });
    }
  });

  // 3. DÜZENLE [D] -> /KullaniciListesi/Duzenle/:id
  router.put('/Duzenle/:id', async (req, res) => {
    try {
      console.log('[D] İşlem Tipi: Kullanıcı Güncelleniyor...');
      const { id } = req.params;
      const guncelVeri = req.body;

      const { data, error } = await supabase
        .from('KULLANICILAR')
        .update(guncelVeri)
        .eq('e_id', id)
        .select();

      if (error) throw error;
      res.json({ islemTag: 'D', success: true, message: 'Kayıt güncellendi kanka!', data: data[0] });
    } catch (err) {
      res.status(500).json({ islemTag: 'D', success: false, error: err.message });
    }
  });

  // 4. SİL [S] -> /KullaniciListesi/Sil/:id
  router.delete('/Sil/:id', async (req, res) => {
    try {
      console.log('[S] İşlem Tipi: Kullanıcı Siliniyor...');
      const { id } = req.params;

      const { error } = await supabase
        .from('KULLANICILAR')
        .delete()
        .eq('e_id', id);

      if (error) throw error;
      res.json({ islemTag: 'S', success: true, message: 'Kayıt sistemden uçuruldu!' });
    } catch (err) {
      res.status(500).json({ islemTag: 'S', success: false, error: err.message });
    }
  });

  return router;
}

module.exports = kullaniciIslemleri;
