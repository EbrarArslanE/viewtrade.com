import { useEffect, useMemo, useState } from 'react'
import { Building2, Plus, RefreshCw, Trash2, X } from 'lucide-react'
import Swal from 'sweetalert2'

const emptyForm = {
	adSoyad: '',
	eposta: '',
	rol: '',
	telNo: '',
	durum: 'Aktif',
}

export default function FirmaTanimlari({ apiBaseUrl, aktifKullanici, onHome }) {
	const [liste, setListe] = useState([])
	const [yukleniyor, setYukleniyor] = useState(false)
	const [hata, setHata] = useState('')
	const [modalAcikMi, setModalAcikMi] = useState(false)
	const [form, setForm] = useState(emptyForm)

	async function listeyiGetir() {
		setYukleniyor(true)
		setHata('')

		try {
			const response = await fetch(`${apiBaseUrl}/FirmaListesi/Listele`)
			const payload = await response.json()

			if (!response.ok || !payload.success) {
				throw new Error(payload.error || 'Firma listesi alınamadı')
			}

			setListe(Array.isArray(payload.data) ? payload.data : [])
		} catch (error) {
			console.error('Firma listesi alınamadı:', error)
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
			adSoyad: item.e_firma_adi || item.e_ad_soyad || item.e_unvan || 'İsimsiz Firma',
			eposta: item.e_eposta || '-',
			rol: item.e_rol || item.e_sektor || '-',
			durum: item.e_durum || item.status || 'Bilinmiyor',
			kaynak: 'servis',
		}))
	}, [liste])

	async function handleFirmaSil(firma) {
		if (!firma?.id) {
			setHata('Silme işlemi için firma kimliği bulunamadı')
			return
		}

		const sonuc = await Swal.fire({
			title: 'Kayıt silinsin mi?',
			text: `${firma.adSoyad} kaydını silmek istiyor musun?`,
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
			const response = await fetch(`${apiBaseUrl}/FirmaListesi/Sil/${firma.id}`, {
				method: 'DELETE',
			})

			const payload = await response.json()

			if (!response.ok || !payload.success) {
				throw new Error(payload.error || 'Firma silinirken bir hata oluştu')
			}

			await listeyiGetir()
		} catch (error) {
			console.error('Firma silme hatası:', error)
			setHata(error.message)
		}
	}

	function handleFormDegisimi(event) {
		const { name, value } = event.target
		setForm((onceki) => ({ ...onceki, [name]: value }))
	}

  async function handleFirmaEkle(event) {
    event.preventDefault()
    setHata('')

		const sirketId = aktifKullanici?.e_sirket_id || aktifKullanici?.sirket_id || 1

    const yeniKullaniciPayload = {
			e_firma_adi: form.adSoyad.trim(),
			e_tel_no: form.telNo.trim(),
			e_eposta: form.eposta.trim(),
			e_sektor: form.rol.trim(),
			e_durum: form.durum,
			e_sirket_id: sirketId,
    }

    try {
			const response = await fetch(`${apiBaseUrl}/FirmaListesi/Ekle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(yeniKullaniciPayload),
      })

      const payload = await response.json()

      if (!response.ok || !payload.success) {
				throw new Error(payload.error || 'Firma eklenirken bir hata oluştu!')
      }

      console.log('[E] Başarılı:', payload.message)

      await listeyiGetir()

      setModalAcikMi(false)
      setForm(emptyForm)

    } catch (error) {
			console.error('Firma ekleme hatası:', error)
      setHata(error.message)
    }
  }

	function handleModalKapat() {
		setModalAcikMi(false)
		setForm(emptyForm)
	}

	return (
		<section className="profile-panel">
			<div className="profile-head">
				<div>
					<span className="eyebrow">Firma yönetimi</span>
					<h3>Firma Tanımları</h3>
					<p>Veriler doğrudan <strong>FirmaListesi</strong> tablosuna bağlı servis üzerinden yönetilir.</p>
				</div>

				<div className="profile-actions">
					<button type="button" className="secondary-button display flex justify-center items-center gap-2" onClick={listeyiGetir}>
						<RefreshCw size={16} />
						Yenile
					</button>
					<button type="button" className="secondary-button display flex justify-center items-center gap-2" onClick={onHome}>
						<Building2 size={16} />
						Ana Sayfa
					</button>
					<button type="button" className="primary-button display flex justify-center items-center gap-2" onClick={() => setModalAcikMi(true)}>
						<Plus size={16} />
						Firma Ekle
					</button>
				</div>
			</div>

		<div className="profile-summary-grid profile-summary-grid-single">
			<article className="profile-summary-card accent-blue">
					<span>Toplam firma</span>
					<strong>{kartlar.length}</strong>
				</article>
			</div>

			{/* <div className="profile-list-head">
				<h4>Card Card Kullanıcılar</h4>
				<p>Her kullanıcıyı ayrı kartta gösterir. Yeni kayıtlar modal üzerinden eklenir.</p>
			</div> */}

			{yukleniyor && <p className="profile-feedback">Kullanıcılar yükleniyor...</p>}
			{hata && <p className="profile-feedback error">{hata}</p>}

			{!yukleniyor && !hata && (
				<div className="profile-list user-card-grid">
					{kartlar.length === 0 ? (
						<div className="profile-empty">
							<strong>Firma bulunamadı</strong>
							<span>FirmaListesi tablosunda gösterilecek kayıt yok.</span>
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
										<button
											type="button"
											className="icon-button danger"
											onClick={() => handleFirmaSil(kullanici)}
											aria-label={`${kullanici.adSoyad} firmasını sil`}
										>
										<Trash2 size={16} />
									</button>
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
										<dt>Sektör</dt>
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
								<span className="eyebrow">Yeni firma</span>
								<h3>Firma Ekle</h3>
							</div>
							<button type="button" className="icon-button" onClick={handleModalKapat}>
								<X size={18} />
							</button>
						</div>

						<form className="login-form" onSubmit={handleFirmaEkle}>
							<div className="profile-form-grid">
								<div className="field-block">
									<label>Firma Adı</label>
									<input name="adSoyad" value={form.adSoyad} onChange={handleFormDegisimi} placeholder="Firma Adı" required />
								</div>
								<div className="field-block">
									<label>E-posta</label>
									<input name="eposta" type="email" value={form.eposta} onChange={handleFormDegisimi} placeholder="ornek@domain.com" required />
								</div>
								<div className="field-block">
									<label>Sektör</label>
									<input name="rol" value={form.rol} onChange={handleFormDegisimi} placeholder="Sektör / Hizmet Alanı" required />
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
							</div>

							<div className="form-actions">
								<button type="button" className="secondary-button" onClick={handleModalKapat}>
									İptal
								</button>
								<button type="submit" className="primary-button">
									Firma Kaydet
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</section>
	)
}
