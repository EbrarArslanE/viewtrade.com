const express = require('express');
const puppeteer = require('puppeteer');

function formatMoney(value) {
  const sayi = Number(value || 0);
  if (Number.isNaN(sayi)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(sayi);
}

module.exports = function (supabase) {
  const router = express.Router();

  // GET -> /pdfIslemleri/VarlikRaporu/:kullaniciId
  router.get('/VarlikRaporu/:kullaniciId', async (req, res) => {
    let browser = null;
    try {
      const { kullaniciId } = req.params;

      if (!kullaniciId) {
        return res.status(400).json({ success: false, message: 'Kullanıcı ID zorunludur.' });
      }

      // 1. Veritabanından Kullanıcı Varlıklarını Çek
      const { data, error } = await supabase
        .from('KULLANICI_VARLIKLARI')
        .select('*')
        .eq('e_kullanici_id', kullaniciId);

      if (error) throw error;

      const kullanici = data[0] || {};
      const adSoyad = kullanici.e_ad_soyad || 'İsimsiz Kullanıcı';
      const eposta = kullanici.e_eposta || '-';
      const telefon = kullanici.e_telefon || '-';
      const tarih = new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Hesaplamalar
      let toplamPortfoyDegeri = 0;
      const satirHtml = data
        .map((item) => {
          const adet = Number(item.e_adet || 0);
          const maliyet = Number(item.e_ortalama_maliyet || 0);
          const toplam = adet * maliyet;
          toplamPortfoyDegeri += toplam;

          return `
            <tr>
              <td><strong>${item.e_coin_adi || '-'}</strong> (${item.e_coin_kodu || '-'})</td>
              <td style="text-align: right;">${adet.toFixed(4)}</td>
              <td style="text-align: right;">${formatMoney(maliyet)}</td>
              <td style="text-align: right; font-weight: bold; color: #0d9488;">${formatMoney(toplam)}</td>
            </tr>
          `;
        })
        .join('');

      // 2. Özel Kurumsal HTML/CSS Şablonu (Dark/Modern Finans Teması)
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
            body { padding: 40px; background: #fff; color: #1e293b; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .brand { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
            .brand span { color: #0d9488; }
            .report-title { text-align: right; }
            .report-title h2 { font-size: 18px; color: #334155; text-transform: uppercase; letter-spacing: 1px; }
            .report-title p { font-size: 12px; color: #64748b; margin-top: 4px; }

            .info-grid { display: flex; justify-content: space-between; background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #f1f5f9; }
            .info-box h4 { font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px; }
            .info-box p { font-size: 14px; font-weight: 600; color: #0f172a; }

            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #0f172a; color: #fff; text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            tr:nth-child(even) { background-color: #f8fafc; }

            .summary { display: flex; justify-content: flex-end; margin-top: 20px; }
            .summary-box { width: 300px; background: #0f172a; color: #fff; padding: 20px; border-radius: 8px; }
            .summary-row { display: flex; justify-content: space-between; align-items: center; }
            .summary-row span { font-size: 13px; opacity: 0.8; }
            .summary-row strong { font-size: 20px; color: #2dd4bf; }

            .footer { margin-top: 50px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">TRADE<span>CORE</span></div>
            <div class="report-title">
              <h2>Müşteri Varlık Raporu</h2>
              <p>Rapor Tarihi: ${tarih}</p>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <h4>Müşteri Ad Soyad</h4>
              <p>${adSoyad}</p>
            </div>
            <div class="info-box">
              <h4>E-Posta</h4>
              <p>${eposta}</p>
            </div>
            <div class="info-box">
              <h4>Telefon</h4>
              <p>${telefon}</p>
            </div>
            <div class="info-box">
              <h4>Müşteri ID</h4>
              <p>#${kullaniciId}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Coin / Varlık</th>
                <th style="text-align: right;">Adet</th>
                <th style="text-align: right;">Ort. Maliyet</th>
                <th style="text-align: right;">Toplam Değer</th>
              </tr>
            </thead>
            <tbody>
              ${satirHtml || '<tr><td colspan="4" style="text-align:center;">Varlık Bulunamadı</td></tr>'}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-box">
              <div class="summary-row">
                <span>Toplam Portföy:</span>
                <strong>${formatMoney(toplamPortfoyDegeri)}</strong>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Bu belge Tradecore WAPI Finansal Sistemleri tarafından otomatik üretilmiştir.</p>
          </div>
        </body>
        </html>
      `;

      // 3. Puppeteer ile PDF Render Et
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      });

      await browser.close();

      // 4. PDF Dosyasını Bağlıklarıyla Birlikte Fırlat
      res.setHeader('Content-Type', 'application/pdf');
      // 'attachment' yerine 'inline' yaptık kanka:
      res.setHeader('Content-Disposition', `inline; filename=Tradecore_Varlik_Raporu_${kullaniciId}.pdf`);
      return res.send(pdfBuffer);
    } catch (err) {
      if (browser) await browser.close();
      console.error('PDF Üretim Hatası:', err);
      return res.status(500).json({ success: false, message: 'PDF üretilirken sunucu hatası oluştu.' });
    }
  });

  return router;
};
