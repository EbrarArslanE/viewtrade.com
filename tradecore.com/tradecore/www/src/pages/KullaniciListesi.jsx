import { useEffect, useMemo, useState } from 'react'
import { HomeIcon, Plus, RefreshCw, Trash2, X, Pencil } from 'lucide-react'
import Swal from 'sweetalert2'

const emptyForm = {
  adSoyad: '',
  eposta: '',
  sifre: '',
  rol: '',
  telNo: '',
  durum: 'Aktif',
}

export default function KullaniciListesi({ apiBaseUrl, aktifKullanici, onHome }) {
  const [liste, setListe] = useState([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [modalAcikMi, setModalAcikMi] = useState(false)
  const [duzenlenenKullaniciId, setDuzenlenenKullaniciId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  async function listeyiGetir() {
    setYukleniyor(true)
    setHata('')

    try {
      const response = await fetch(`${apiBaseUrl}/KullaniciListesi/Listele`)
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Kullanıcı listesi alınamadı')
      }

      setListe(Array.isArray(payload.data) ? payload.data : [])
    } catch (error) {
      console.error('Kullanıcı listesi alınamadı:', error)
      setHata(error.message)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    listeyiGetir()
  }, [apiBaseUrl])

  const kartlar = useMemo(() => {
    return liste.map((item, index) => ({
      id: item.e_id || item.id || item.user_id || `${item.e_eposta || item.e_ad_soyad || 'kullanici'}-${index}`,
      adSoyad: item.e_ad_soyad || 'İsimsiz Kullanıcı',
      sifre: item.e_sifre,
      eposta: item.e_eposta || '-',
      telNo: item.e_telefon || '', // Telefon bilgisi eklendi
      rol: item.e_rol || '-',
      durum: item.e_durum || item.status || 'Bilinmiyor',
      kaynak: 'servis',
    }))
  }, [liste])

  async function handleKullaniciSil(kullanici) {
    if (!kullanici?.id) {
      setHata('Silme için kullanıcı kimliği bulunamadı')
      return
    }

    const sonuc = await Swal.fire({
      title: 'Kayıt silinsin mi?',
      text: `${kullanici.adSoyad} kaydını silmek istiyor musun?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'Vazgeç',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#334155',
    })

    if (!sonuc.isConfirmed) {
      return
    }

    setHata('')

    try {
      const response = await fetch(`${apiBaseUrl}/KullaniciListesi/Sil/${kullanici.id}`, {
        method: 'DELETE',
      })

      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Kullanıcı silinirken bir hata oluştu')
      }

      await listeyiGetir()
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error)
      setHata(error.message)
    }
  }

  function handleFormDegisimi(event) {
    const { name, value } = event.target
    setForm((onceki) => ({ ...onceki, [name]: value }))
  }

  function handleKullaniciDuzenle(kullanici) {
    setHata('')
    setDuzenlenenKullaniciId(kullanici.id)
    setForm({
      adSoyad: kullanici.adSoyad || '',
      eposta: kullanici.eposta || '',
      sifre: kullanici.sifre || '',
      rol: kullanici.rol || '',
      telNo: kullanici.telNo || '',
      durum: kullanici.durum || 'Aktif',
    })
    setModalAcikMi(true)
  }

  // 1. YENİ KULLANICI EKLEME (POST)
  async function handleKullaniciEkle(kullaniciPayload) {
    const response = await fetch(`${apiBaseUrl}/KullaniciListesi/Ekle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kullaniciPayload),
    })

    const payload = await response.json()
    if (!response.ok || !payload.success) {
      throw new Error(payload.error || 'Kullanıcı eklenirken bir hata oluştu!')
    }
    console.log('[E] Başarılı:', payload.message)
  }

  // 2. KULLANICI GÜNCELLEME (PUT)
  async function handleKullaniciGuncelle(id, kullaniciPayload) {
    const response = await fetch(`${apiBaseUrl}/KullaniciListesi/Duzenle/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kullaniciPayload),
    })

    const payload = await response.json()
    if (!response.ok || !payload.success) {
      throw new Error(payload.error || 'Kullanıcı güncellenirken bir hata oluştu!')
    }
    console.log('[D] Başarılı:', payload.message)
  }

  // 3. FORM SUBMIT HANDLER (Ana Tetikleyici)
  async function handleFormSubmit(event) {
    event.preventDefault()
    setHata('')

    const sirketId = aktifKullanici?.e_sirket_id || aktifKullanici?.sirket_id || 1
    const duzenlemeModu = Boolean(duzenlenenKullaniciId)

    const kullaniciPayload = {
      e_ad_soyad: form.adSoyad.trim(),
      e_sifre: form.sifre.trim(),
      e_telefon: form.telNo.trim(),
      e_eposta: form.eposta.trim(),
      e_rol: form.rol,
      e_durum: form.durum,
      e_sirket_id: sirketId,
    }

    try {
      if (duzenlemeModu) {
        await handleKullaniciGuncelle(duzenlenenKullaniciId, kullaniciPayload)
      } else {
        await handleKullaniciEkle(kullaniciPayload)
      }

      await listeyiGetir()
      setModalAcikMi(false)
      setForm(emptyForm)
      setDuzenlenenKullaniciId(null)
    } catch (error) {
      console.error(duzenlemeModu ? 'Kullanıcı güncelleme hatası:' : 'Kullanıcı ekleme hatası:', error)
      setHata(error.message)
    }
  }

  function handleModalKapat() {
    setModalAcikMi(false)
    setForm(emptyForm)
    setDuzenlenenKullaniciId(null)
  }

  return (
    <section className="profile-panel">
      <div className="profile-head">
        <div>
          <span className="eyebrow">Kullanıcı takibi</span>
          <h3>Kullanıcı Listesi</h3>
        </div>

        <div className="profile-actions">
          <button type="button" className="secondary-button display flex justify-center items-center gap-2" onClick={listeyiGetir}>
            <RefreshCw size={16} />
            Yenile
          </button>
          <button type="button" className="primary-button display flex justify-center items-center gap-2" onClick={() => setModalAcikMi(true)}>
            <Plus size={16} />
            Kullanıcı Ekle
          </button>
        </div>
      </div>

      <div className="profile-summary-grid profile-summary-grid-single">
        <article className="profile-summary-card accent-blue">
          <span>Toplam kart</span>
          <strong>{kartlar.length}</strong>
        </article>
      </div>

      {yukleniyor && <p className="profile-feedback">Kullanıcılar yükleniyor...</p>}
      {hata && <p className="profile-feedback error">{hata}</p>}

      {!yukleniyor && !hata && (
        <div className="profile-list user-card-grid">
          {kartlar.length === 0 ? (
            <div className="profile-empty">
              <strong>Liste boş</strong>
              <span>Henüz gösterilecek kullanıcı bulunmuyor.</span>
            </div>
          ) : (
            kartlar.map((kullanici) => (
              <article key={kullanici.id} className="profile-user-card user-tile">
                <div className="profile-user-top">
                  <div className="profile-user-identity">
                    <span className="user-avatar compact">{(kullanici.adSoyad || 'K')[0]}</span>
                    <div>
                      <strong>{kullanici.adSoyad}</strong>
                      <p>{kullanici.rol}</p>
                    </div>
                  </div>
                  <div className="display flex items-center justify-center gap-1.5 flex-row">
                    <button
                      type="button"
                      className="icon-button danger"
                      onClick={() => handleKullaniciSil(kullanici)}
                      aria-label={`${kullanici.adSoyad} kullanıcısını sil`}
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* DÜZELTME 1: Düzeltme fonksiyonu bağlandı */}
                    <button
                      type="button"
                      className="icon-button edit"
                      onClick={() => handleKullaniciDuzenle(kullanici)}
                      aria-label={`${kullanici.adSoyad} kullanıcısını düzenle`}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>

                <div className="user-badge-row">
                  <span className={`source-badge ${kullanici.kaynak === 'yerel' ? 'local' : 'service'}`}>
                    {kullanici.kaynak === 'yerel' ? 'Yerel Kayıt' : 'Servis Kaydı'}
                  </span>
                  <span className={`status-badge ${String(kullanici.durum).toLowerCase()}`}>{kullanici.durum}</span>
                </div>

                <dl className="profile-meta-grid">
                  <div>
                    <dt>E-posta</dt>
                    <dd>{kullanici.eposta}</dd>
                  </div>
                  <div>
                    <dt>Rol</dt>
                    <dd>{kullanici.rol}</dd>
                  </div>
                </dl>
              </article>
            ))
          )}
        </div>
      )}

      {modalAcikMi && (
        <div className="modal-backdrop">
          <div className="modal-card modal-wide">
            <div className="modal-head">
              <div>
                <span className="eyebrow">{duzenlenenKullaniciId ? 'Kullanıcı düzenle' : 'Yeni kullanıcı'}</span>
                <h3>{duzenlenenKullaniciId ? 'Kullanıcı Düzenle' : 'Kullanıcı Ekle'}</h3>
              </div>
              <button type="button" className="icon-button" onClick={handleModalKapat}>
                <X size={18} />
              </button>
            </div>

            {/* DÜZELTME 2: Form submit handler'ı bağlandı */}
            <form className="login-form" onSubmit={handleFormSubmit}>
              <div className="profile-form-grid">
                <div className="field-block">
                  <label>Ad Soyad</label>
                  <input name="adSoyad" value={form.adSoyad} onChange={handleFormDegisimi} placeholder="Ad Soyad" required />
                </div>
                <div className="field-block">
                  <label>E-posta</label>
                  <input name="eposta" type="email" value={form.eposta} onChange={handleFormDegisimi} placeholder="ornek@domain.com" required />
                </div>
                <div className="field-block">
                  <label>Rol</label>
                  <select name="rol" value={form.rol} onChange={handleFormDegisimi} required>
                    <option value="">--- Seçiniz ---</option>
                    <option value="Yönetici">Yönetici</option>
                    <option value="Yetkili">Yetkili</option>
                    <option value="Muhasebeci">Muhasebeci</option>
                    <option value="Bayi">Bayi</option>
                  </select>
                </div>
                <div className="field-block">
                  <label>Durum</label>
                  <select name="durum" value={form.durum} onChange={handleFormDegisimi}>
                    <option>Aktif</option>
                    <option>Pasif</option>
                    <option>Beklemede</option>
                  </select>
                </div>
                <div className="field-block col-md-12">
                  <label>Telefon Numarası</label>
                  <input name="telNo" value={form.telNo} onChange={handleFormDegisimi} placeholder="Telefon Numarası" required />
                </div>
                <div className="field-block col-md-12">
                  <label>Şifre</label>
                  <input type="password" name="sifre" value={form.sifre} onChange={handleFormDegisimi} placeholder="Şifre" required />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={handleModalKapat}>
                  İptal
                </button>
                <button type="submit" className="primary-button">
                  {duzenlenenKullaniciId ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
