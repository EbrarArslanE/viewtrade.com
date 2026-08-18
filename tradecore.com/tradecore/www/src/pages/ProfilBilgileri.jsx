import { useEffect, useState } from 'react'
import { RefreshCw, UserRound } from 'lucide-react'

export default function ProfilBilgileri({ apiBaseUrl, aktifKullanici, onHome }) {
  const [kullaniciListesi, setKullaniciListesi] = useState([])
  const [listeYukleniyorMu, setListeYukleniyorMu] = useState(false)
  const [listeHatasi, setListeHatasi] = useState('')

  async function kullanicilariGetir() {
    setListeYukleniyorMu(true)
    setListeHatasi('')

    try {
      // const response = await fetch(`${apiBaseUrl}/KullaniciListesi/Listele`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Kullanıcı listesi alınamadı')
      }

      setKullaniciListesi(Array.isArray(payload.data) ? payload.data : [])
    } catch (error) {
      console.error('Kullanıcı listesi hatası:', error)
      setListeHatasi(error.message)
    } finally {
      setListeYukleniyorMu(false)
    }
  }

  useEffect(() => {
    kullanicilariGetir()
  }, [apiBaseUrl])

  return (
    <section className="profile-panel">
      <div className="profile-head">
        <div>
          <span className="eyebrow">Profil merkezi</span>
          <h3>Kullanıcı Bilgileri</h3>
          <p>Kullanıcı listesini servis yanıtından çekip profil görünümünde gösteriyoruz.</p>
        </div>

        <div className="profile-actions">
          <div className="w-100 h-11 display flex items-center justify-center gap-1">
          <button type="button" className="secondary-button w-1/2" onClick={kullanicilariGetir}>
            Yenile
          </button>
          <button type="button" className="secondary-button w-1/2" onClick={onHome}>
            Geri Dön
          </button>
          </div>
        </div>
      </div>

      <div className="profile-summary-grid w-full">
        <article className="profile-summary-card accent-blue w-1/2">
          <span>Toplam kayıt</span>
          <strong>{kullaniciListesi.length}</strong>
        </article>
        <article className="profile-summary-card accent-green w-1/2">
          <span>Aktif oturum</span>
          <strong>{aktifKullanici ? 'Açık' : 'Kapalı'}</strong>
        </article>
      </div>

      {!listeYukleniyorMu && !listeHatasi && (
        <div className="profile-list">
          {kullaniciListesi.length === 0 ? (
            <div className="profile-empty">
              <strong>Liste boş</strong>
              <span>Servisten veri gelmediği için kullanıcı kartı oluşturulamadı.</span>
            </div>
          ) : (
            kullaniciListesi.map((kullanici) => (
              <article key={kullanici.id || kullanici.e_eposta || kullanici.e_ad_soyad} className="profile-user-card">
                <div className="profile-user-top">
                  <span className="user-avatar compact">{(kullanici.e_ad_soyad || 'K')[0]}</span>
                  <div>
                    <strong>{kullanici.e_ad_soyad || 'İsimsiz Kullanıcı'}</strong>
                    <p>{kullanici.e_rol || 'Rol bilgisi yok'}</p>
                  </div>
                </div>

                <dl className="profile-meta-grid">
                  <div>
                    <dt>E-posta</dt>
                    <dd>{kullanici.e_eposta || '-'}</dd>
                  </div>
                  <div>
                    <dt>Yetki</dt>
                    <dd>{kullanici.e_rol || '-'}</dd>
                  </div>
                  <div>
                    <dt>Durum</dt>
                    <dd>{kullanici.e_durum || kullanici.status || 'Bilinmiyor'}</dd>
                  </div>
                  <div>
                    <dt>ID</dt>
                    <dd>{kullanici.id || kullanici.user_id || '-'}</dd>
                  </div>
                </dl>
              </article>
            ))
          )}
        </div>
      )}

      {aktifKullanici && (
        <article className="profile-user-card" style={{ marginTop: '18px' }}>
          <div className="profile-user-top">
            <span className="user-avatar compact"><UserRound size={18} /></span>
            <div>
              <strong>Aktif Kullanıcı</strong>
              <p>{aktifKullanici.e_ad_soyad} · {aktifKullanici.e_rol}</p>
            </div>
          </div>
          <dl className="profile-meta-grid">
            <div>
              <dt>Ad Soyad</dt>
              <dd>{aktifKullanici.e_ad_soyad || '-'}</dd>
            </div>
            <div>
              <dt>E-posta</dt>
              <dd>{aktifKullanici.e_eposta || '-'}</dd>
            </div>
          </dl>
          <dl className="profile-meta-grid w-full">
            <div className="w-full">
              <dt>Bakiye</dt>
              <dd>{aktifKullanici.e_bakiye || '-'}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  )
}
