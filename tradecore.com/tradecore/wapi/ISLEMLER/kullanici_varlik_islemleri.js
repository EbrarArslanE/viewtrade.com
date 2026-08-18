const express = require('express');

module.exports = function (supabase) {
  const router = express.Router();
  router.get('/Listele/:kullaniciId', async (req, res) => {
    try {
      const { kullaniciId } = req.params;
      if (!kullaniciId) {
        return res.status(400).json({ success: false, message: 'Kullanıcı ID parametresi zorunludur.', });
      }
      const { data, error } = await supabase.from('KULLANICI_VARLIKLARI').select('*').eq('e_kullanici_id', kullaniciId);
      if (error) {
        throw error;
      }
      return res.status(200).json({ success: true, count: data.length, data: data, });
    } catch (err) {
      console.error('Kullanıcı varlıkları getirme hatası:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Sunucu hatası, varlıklar getirilemedi.',
        error: err.message,
      });
    }
  });

  return router;
};
