import { useEffect, useState } from 'react'
import { ArrowLeft, Clock3, RefreshCw, ShieldCheck, UserRound, Wallet } from 'lucide-react'

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

export default function BakiyeBilgileri({ apiBaseUrl, aktifKullanici, onHome }) {
	const [bakiyeListesi, setBakiyeListesi] = useState([])
	const [yukleniyor, setYukleniyor] = useState(false)
	const [hata, setHata] = useState('')

	const kullaniciId = aktifKullanici?.e_kullanici_id || aktifKullanici?.e_id || aktifKullanici?.id || ''

	async function bakiyeBilgisiGetir() {
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
		bakiyeBilgisiGetir()
	}, [apiBaseUrl, kullaniciId])

	const coinListesi = bakiyeListesi.map((item) => {
		const coin = item.COIN_LISTESI || {}

		return {
			id: item.e_id || `${item.e_kullanici_id || kullaniciId}-${coin.e_coin_kodu || coin.e_coin_ad || 'coin'}`,
			coinAdi: coin.e_coin_ad || 'İsimsiz Coin',
			coinKodu: coin.e_coin_kodu || '-',
			adet: item.e_adet ?? 0,
			kullaniciId: item.e_kullanici_id || kullaniciId,
		}
	})

	const bakiyeDurumu = bakiyeListesi[0]?.e_durum || aktifKullanici?.e_durum || 'Aktif'
	const toplamCoinCinsi = coinListesi.length
	const toplamAdet = coinListesi.reduce((toplam, item) => toplam + Number(item.adet || 0), 0)
	const sonGuncelleme = bakiyeListesi[0]?.updated_at || bakiyeListesi[0]?.created_at || aktifKullanici?.updated_at || aktifKullanici?.created_at

	return (
		<section className="profile-panel balance-panel">
			<div className="balance-hero">
				<div className="balance-hero-copy">
					<span className="eyebrow">Finans merkezi</span>
					<h3>Bakiye Bilgileri</h3>
					<p>Aktif kullanıcının bakiyesi, <strong>e_kullanici_id</strong> üzerinden servisden çekilir ve kart görünümünde gösterilir.</p>

					<div className="balance-hero-actions">
						<button type="button" className="secondary-button" onClick={bakiyeBilgisiGetir}>
							<RefreshCw size={16} />
							Yenile
						</button>
						<button type="button" className="primary-button" onClick={onHome}>
							<ArrowLeft size={16} />
							Ana Sayfa
						</button>
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
							<Clock3 size={16} />
							<span>Son güncelleme</span>
						</div>
						<strong>{sonGuncelleme || '-'}</strong>
						<p>Veri zaman damgası mevcutsa burada gösterilir.</p>
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
					<div className="section-head balance-section-head">
						<h3>Coin Portföyü</h3>
						<p>Kullanıcının tüm coinleri kart ve tablo hissini birlikte veren listede gösterilir.</p>
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
