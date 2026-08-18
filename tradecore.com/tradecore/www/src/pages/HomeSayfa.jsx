export default function HomeSayfa() {
  return (
    <>
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Operasyon merkezi</span>
          <h2>Global Piyasa & Hazine Akışı</h2>
          <p>
            Şirket içi varlık yönetimi, canlı finans raporları ve operasyonel takip paneli.
            Daha yoğun, daha okunaklı ve daha premium bir arayüz için yeniden kurgulandı.
          </p>
        </div>
        <div className="hero-metrics">
          <div>
            <strong>24/7</strong>
            <span>Canlı izleme</span>
          </div>
          <div>
            <strong>12</strong>
            <span>Aktif modül</span>
          </div>
          <div>
            <strong>99.98%</strong>
            <span>Uptime hedefi</span>
          </div>
        </div>
      </section>

      <div className="section-head">
        <h3>Son Sistem Gelişmeleri & Raporlar</h3>
        <p>Önemli güncellemeler, otomasyonlar ve güvenlik notları.</p>
      </div>

      <div className="card-grid">
        <article className="info-card accent-blue">
          <span className="card-chip">SİSTEM</span>
          <h4>QuestPDF Modülleri Entegre Edildi</h4>
          <p>Nereora ve Sipahi Güvenlik için tasarlanan dinamik PDF fatura modülleri canlıya alındı.</p>
        </article>

        <article className="info-card accent-green">
          <span className="card-chip">KASA</span>
          <h4>USD / USDT Kur Güncellemesi</h4>
          <p>Merkez bankası ve Binance public API entegrasyonu ile hazine kasası eşitlemeleri aktif edildi.</p>
        </article>

        <article className="info-card accent-amber">
          <span className="card-chip">GÜVENLİK</span>
          <h4>Oturum Sürekliliği Sağlandı</h4>
          <p>localStorage desteği ile sayfa yenilemelerinde oturumun düşmesi sorunu ortadan kaldırıldı.</p>
        </article>
      </div>
    </>
  )
}
