import { useEffect, useState } from 'react'
import { RefreshCw, ShieldCheck, UserRound, Wallet, FileText } from 'lucide-react'

function formatMoney(value) {
  const sayi = Number(value || 0)

  if (Number.isNaN(sayi)) {
    return value || '-'
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(sayi)
}

export default function KullaniciVarliklari({ apiBaseUrl, aktifKullanici, onHome }) {
  const [varlikListesi, setVarlikListesi] = useState([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  const kullaniciId = aktifKullanici?.e_kullanici_id || aktifKullanici?.e_id || ''

  async function kullaniciVarlikBilgisiGetir() {
    if (!kullaniciId) {
      setHata('Varlık bilgisi için kullanıcı kimliği bulunamadı.')
      return
    }

    setYukleniyor(true)
    setHata('')

    try {
      const response = await fetch(`${apiBaseUrl}/kullaniciVarlikIslemleri/Listele/${kullaniciId}`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || 'Varlık bilgisi alınamadı.')
      }

      const sonuc = Array.isArray(payload.data) ? payload.data : payload.data ? [payload.data] : []
      setVarlikListesi(sonuc)
    } catch (error) {
      console.error('Varlık bilgisi alınamadı:', error)
      setHata(error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    kullaniciVarlikBilgisiGetir()
  }, [apiBaseUrl, kullaniciId])

  const coinListesi = varlikListesi.map((varlik) => {
    const adet = Number(varlik.e_adet || 0)
    const maliyet = Number(varlik.e_ortalama_maliyet || 0)

    return {
      id: varlik.e_id || `${kullaniciId}-${varlik.e_coin_kodu || varlik.e_coin_ad || 'coin'}`,
      coinAdi: varlik.e_coin_ad || 'Bilinmeyen Coin',
      coinKodu: varlik.e_coin_kodu || '-',
      adet,
      maliyet,
      toplamDeger: adet * maliyet,
    }
  })

  const toplamCoinCinsi = coinListesi.length
  const toplamAdet = coinListesi.reduce((toplam, varlik) => toplam + varlik.adet, 0)
  const portfoyToplamDegeri = coinListesi.reduce((toplam, varlik) => toplam + varlik.toplamDeger, 0)
  const ilkKullanici = coinListesi[0] || {}

  const pdfRaporuGoruntule = () => {
    if (!kullaniciId) return;
    // Yeni sekmede backend'e istek atar, tarayıcı PDF'i sekmede açar
    window.open(`${apiBaseUrl}/pdfIslemleri/VarlikRaporu/${kullaniciId}`, '_blank');
  };

  return (
    <section className="profile-panel balance-panel">
      <div className="balance-hero">
        <div className="balance-hero-copy">
          <span className="eyebrow">Portföy Yönetimi</span>
          <h3>Kullanıcı Varlıkları</h3>

          <div className="balance-hero-actions">
            <button type="button" className="secondary-button display flex items-center justify-center gap-1.5" onClick={pdfRaporuGoruntule}>
              <FileText size={16} />
              PDF'e Aktar
            </button>
          </div>
        </div>

        <div className="balance-hero-card">
          <div className="balance-icon-wrap">
            <Wallet size={22} />
          </div>
          <span>Toplam Portföy Değeri</span>
          <strong>{formatMoney(portfoyToplamDegeri)}</strong>
          <small>{kullaniciId ? `Sorgu kimliği: ${kullaniciId}` : 'Kullanıcı kimliği bulunamadı'}</small>
        </div>
      </div>

      {yukleniyor && <p className="profile-feedback">Varlık bilgisi yükleniyor...</p>}
      {hata && <p className="profile-feedback error">{hata}</p>}

      {!yukleniyor && !hata && (
        <>
          <div className="balance-grid">
            <article className="balance-card accent-blue">
              <div className="balance-card-head">
                <UserRound size={16} />
                <span>Kullanıcı Bilgisi</span>
              </div>
              <strong>{aktifKullanici?.e_ad_soyad || 'İsimsiz Kullanıcı'}</strong>
              <p>{aktifKullanici?.e_eposta || '-'}</p>
            </article>

            <article className="balance-card accent-green">
              <div className="balance-card-head">
                <ShieldCheck size={16} />
                <span>Telefon</span>
              </div>
              <strong>{aktifKullanici?.e_telefon || '-'}</strong>
              <p>Doğrulanmış İletişim</p>
            </article>

            <article className="balance-card accent-amber">
              <div className="balance-card-head">
                <Wallet size={16} />
                <span>Çeşitlilik</span>
              </div>
              <strong>{toplamCoinCinsi} Farklı Coin</strong>
              <p>Portföydeki toplam varlık türü</p>
            </article>

            <article className="balance-card balance-wide">
              <div className="balance-card-head">
                <Wallet size={16} />
                <span>Varlık Özeti</span>
              </div>
              <div className="balance-summary-row">
                <div>
                  <small>Toplam Coin Adedi</small>
                  <strong>{toplamAdet}</strong>
                </div>
                <div>
                  <small>Kullanıcı ID</small>
                  <strong>{kullaniciId || '-'}</strong>
                </div>
              </div>
            </article>
          </div>

          <section className="balance-portfolio-section">
            <div className="section-head balance-section-head">
              <h3>Varlık Portföyü</h3>
              <p>Kullanıcının hesabındaki coinler, adet ve ortalama maliyet detaylarıyla gösterilir.</p>
            </div>

            {coinListesi.length === 0 ? (
              <div className="profile-empty">
                <strong>Varlık bulunamadı</strong>
                <span>Bu kullanıcı için henüz cüzdan varlık kaydı bulunmuyor.</span>
              </div>
            ) : (
              <div className="balance-coin-list">
                {coinListesi.map((coin) => (
                  <article key={coin.id} className="balance-coin-card">
                    <div className="balance-coin-main">
                      <div className="balance-coin-title">
                        <div className="coin-avatar">{(coin.coinAdi || 'C')[0]}</div>
                        <div>
                          <strong>{coin.coinAdi}</strong>
                          <span>{coin.coinKodu}</span>
                        </div>
                      </div>
                      <div className="balance-coin-amount">
                        <small>Adet</small>
                        <strong>{coin.adet}</strong>
                      </div>
                    </div>

                    <div className="balance-coin-meta">
                      <div>
                        <small>Ort. Maliyet</small>
                        <strong>{formatMoney(coin.maliyet)}</strong>
                      </div>
                      <div>
                        <small>Toplam Değer</small>
                        <strong>{formatMoney(coin.toplamDeger)}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  )
}
