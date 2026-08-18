import { useEffect, useState } from 'react'
import { ArrowLeft, Clock3, PlusCircle, RefreshCw, ShieldCheck, UserRound, Wallet, X, Coins } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-toastify'

function formatMoney(value) {
	const sayi = Number(value || 0)

	if (Number.isNaN(sayi)) {
		return value || '-'
	}

	return new Intl.NumberFormat('tr-TR', {
		style: 'currency',
		currency: 'TRY',
		maximumFractionDigits: 2,
	}).format(sayi)
}

export default function BakiyeBilgileri({ apiBaseUrl, aktifKullanici, onHome, toastOptions }) {
	const [bakiyeListesi, setBakiyeListesi] = useState([])
	const [yukleniyor, setYukleniyor] = useState(false)
	const [hata, setHata] = useState('')
	const [modalAcikMi, setModalAcikMi] = useState(false)

	const kullaniciId = aktifKullanici?.e_kullanici_id || aktifKullanici?.e_id || aktifKullanici?.id || ''


	const [bakiyeBilgisi, setBakiyeBilgisi] = useState(aktifKullanici?.e_bakiye || 0)
  const [bakiyeBilgisiGuncel, setBakiyeBilgisiGuncel] = useState('')

	useEffect(() =>{
		if(aktifKullanici){
			setBakiyeBilgisi(aktifKullanici?.e_bakiye ?? aktifKullanici?.bakiye ?? 0)
		}
	}, [aktifKullanici])

	async function handleBakiyeYukleme(e) {
    e.preventDefault()

		const eklenecekTutar = Number(bakiyeBilgisiGuncel)
		if (isNaN(eklenecekTutar) || eklenecekTutar <= 0) {
			toast.error('Lütfen Geçerli bir tutar girin.', toastOptions)
			return
		}

		const loadingToastId = toast.loading('Bakiye güncelleniyor...', {
			...toastOptions,
			autoClose: false,
			closeButton: false,
		})

		try {
			if (!['Yönetici', 'Muhasebeci'].includes(aktifKullanici?.e_rol)){
				toast.update(loadingToastId,{
					render:'Yetkiniz bu işlemi yapmak için yeterli değil, lütfen yetkiliye başvurun.',
					type: 'error',
					isLoading: false,
					autoClose: 3000,
					closeButton: false,
				})
				return
			}

			const yeniBakiye = Number(bakiyeBilgisi) + eklenecekTutar

			const { data, error } = await supabase

			.from('KULLANICILAR')
			.update({e_bakiye : yeniBakiye})
			.eq('e_id', kullaniciId)
			.select()
			if (error) throw error

			setBakiyeBilgisi(yeniBakiye)
			setBakiyeBilgisiGuncel('')

			toast.update(loadingToastId, {
				render: `Bakiye Başarıyla eklendi! Yeni bakiye: ${formatMoney(yeniBakiye)}`,
				type: 'success',
				isLoading: false,
				autoClose: 1800,
				closeButton: false,
			})
		} catch (error) {
			console.error('Supabase Hatası:', error)
			toast.update(loadingToastId,{
				render:'Sorgulanırken bir hata oluştu.' + error.message,
				type: 'error',
				isLoading: false,
				autoClose: 3500,
				closeButton: false,
			})

		}

  }

	async function coinBakiyeBilgisiGetir() {
		if (!kullaniciId) {
			setHata('Bakiye bilgisi için kullanıcı kimliği bulunamadı')
			return
		}
		setYukleniyor(true)
		setHata('')
		try {
			const response = await fetch(`${apiBaseUrl}/BakiyeBilgileri/Listele/${kullaniciId}`)
			const payload = await response.json()

			if (!response.ok || !payload.success) {
				throw new Error(payload.error || 'Bakiye bilgisi alınamadı')
			}

			setBakiyeListesi(Array.isArray(payload.data) ? payload.data : payload.data ? [payload.data] : [])
		} catch (error) {
			console.error('Bakiye bilgisi alınamadı:', error)
			setHata(error.message)
		} finally {
			setYukleniyor(false)
		}
	}

	useEffect(() => {
		coinBakiyeBilgisiGetir()
	}, [apiBaseUrl, kullaniciId])

	const coinListesi = bakiyeListesi.map((item) => {
		const coin = item.COIN_LISTESI || {}

		return {
			id: item.e_id || `${item.e_kullanici_id || kullaniciId}-${coin.e_coin_kodu || coin.e_coin_ad || 'coin'}`,
			coinAdi: item.e_coin_ad || 'İsimsiz Coin',
			coinKodu: coin.e_coin_kodu || '-',
			adet: item.e_adet ?? 0,
			kullaniciId: item.e_kullanici_id || kullaniciId,
			bakiyeBilgisi: item.e_bakiye
		}
	})

	const bakiyeDurumu = bakiyeListesi[0]?.e_durum || aktifKullanici?.e_durum || 'Aktif'
	const toplamCoinCinsi = coinListesi.length
	const toplamAdet = coinListesi.reduce((toplam, item) => toplam + Number(item.adet || 0), 0)
	const sonGuncelleme = bakiyeListesi[0]?.updated_at || bakiyeListesi[0]?.created_at || aktifKullanici?.updated_at || aktifKullanici?.created_at
	const bakiye = bakiyeListesi[0]?.e_bakiye

	return (
		<section className="profile-panel balance-panel">
			<div className="balance-hero">
				<div className="balance-hero-copy">
					<span className="eyebrow">Finans merkezi</span>
					<h3>Bakiye Bilgileri</h3>
					<p>Aktif kullanıcının bakiyesi, <strong>e_kullanici_id</strong> üzerinden servisden çekilir ve kart görünümünde gösterilir.</p>

					<div className="balance-hero-actions">
						<button type="button" className="primary-button" onClick={() => setModalAcikMi(true)}>
							<PlusCircle size={16} />
							Yeni Bakiye Ekle
						</button>
							{modalAcikMi && (
								<div className="modal-backdrop">
									<div className="modal-card">
										<div className="modal-head">
											<div>
												<span className="eyebrow">Yetkili erişim</span>
												<h3>Bakiye Ekle</h3>
											</div>
											<button onClick={() => setModalAcikMi(false)} className="icon-button" type="button">
												<X size={18} />
											</button>
										</div>

										<form onSubmit={handleBakiyeYukleme} className="login-form">
											<div className="field-block">
												<label>Mevcut Bakiyeniz</label>
												<input type="text" value={formatMoney(bakiyeBilgisi)} readOnly disabled/>
											</div>

											<div className="field-block">
												<label>Eklemek İstediğiniz Tutar</label>
												<input type="text" placeholder="Eklemek istediğiniz tutarı girin" value={bakiyeBilgisiGuncel} onChange={(e) => setBakiyeBilgisiGuncel(e.target.value)} required />
											</div>

											<div className="form-actions">
												<button type="button" onClick={() => setModalAcikMi(false)} className="secondary-button" >
													İptal
												</button>
												<button type="submit" className="primary-button" >
													Bakiye Ekle
												</button>
											</div>
										</form>

									</div>
								</div>
							)}
					</div>
				</div>

				<div className="balance-hero-card">
					<div className="balance-icon-wrap">
						<Wallet size={22} />
					</div>
					<span>Toplam coin miktarı</span>
					<strong>{toplamAdet}</strong>
					<small>{kullaniciId ? `Sorgu kimliği: ${kullaniciId}` : 'Kullanıcı kimliği bulunamadı'}</small>
				</div>
			</div>

			{yukleniyor && <p className="profile-feedback">Bakiye bilgisi yükleniyor...</p>}
			{hata && <p className="profile-feedback error">{hata}</p>}

			{!yukleniyor && !hata && (
				<div className="balance-grid">
					<article className="balance-card accent-blue">
						<div className="balance-card-head">
							<UserRound size={16} />
							<span>Kullanıcı</span>
						</div>
						<strong>{aktifKullanici?.e_ad_soyad || 'İsimsiz Kullanıcı'}</strong>
						<p>{aktifKullanici?.e_rol || '-'}</p>
					</article>

					<article className="balance-card accent-green">
						<div className="balance-card-head">
							<ShieldCheck size={16} />
							<span>Durum</span>
						</div>
						<strong>{bakiyeDurumu}</strong>
						<p>Bakiye kaydı servis tarafından güncellenir.</p>
					</article>

					<article className="balance-card accent-amber">
						<div className="balance-card-head">
							<Wallet size={16} />
							<span>Bakiyeniz</span>
						</div>
						<strong>{bakiye || '-'}</strong>
						<p>Mevcut nakit bakiyeniz burada gösterilir.</p>
					</article>

					<article className="balance-card balance-wide">
						<div className="balance-card-head">
							<Wallet size={16} />
							<span>Hesap Özeti</span>
						</div>
						<div className="balance-summary-row">
							<div>
								<small>Toplam coin cinsi</small>
								<strong>{toplamCoinCinsi}</strong>
							</div>
							<div>
								<small>Kullanıcı ID</small>
								<strong>{kullaniciId || '-'}</strong>
							</div>
						</div>
					</article>
				</div>
			)}

			{!yukleniyor && !hata && (
				<section className="balance-portfolio-section">
						<div className="w-full display flex-col items-center justify-between gap-5">

							<div className="w-full display flex items-center justify-center pb-5">
								<div className="section-head balance-section-head">
									<h3>Coin Portföyü</h3>
								</div>
							</div>

							<div className="w-full pb-5">
								<button type="button" className="primary-button w-full" onClick={() => setModalAcikMi(true)}>
									<Coins size={16}/>
									Yeni Coin Siparişi Oluştur
								</button>
							</div>
						</div>



					{coinListesi.length === 0 ? (
						<div className="profile-empty">
							<strong>Coin bulunamadı</strong>
							<span>Bu kullanıcı için henüz portföy kaydı gelmedi.</span>
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
											<small>Kullanıcı ID</small>
											<strong>{coin.kullaniciId}</strong>
										</div>
										<div>
											<small>Coin kodu</small>
											<strong>{coin.coinKodu}</strong>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</section>
			)}

			{/* <article className="balance-note-card">
				<div>
					<span className="eyebrow">Bilgi</span>
					<h4>Bakiye sorgusu nasıl çalışır?</h4>
					<p>Bu sayfa aktif kullanıcıdan gelen kimliği alır, servisdeki <strong>/BakiyeBilgileri/Listele/:e_kullanici_id</strong> endpoint’ine gönderir ve sonucu kartlarda gösterir.</p>
				</div>
			</article> */}
		</section>
	)
}
