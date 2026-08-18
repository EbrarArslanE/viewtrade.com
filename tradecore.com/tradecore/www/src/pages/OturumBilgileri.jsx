import { LogIn, LogOut, ShieldCheck } from 'lucide-react'

export default function OturumBilgileri({ aktifKullanici, onGirisAc, onCikisYap, onHome }) {
	return (
		<section className="profile-panel">
			<div className="profile-head">
				<div>
					<span className="eyebrow">Oturum merkezi</span>
					<h3>Aktif Oturum</h3>
					<p>Giriş durumunu, tarayıcıda saklanan oturumu ve hızlı işlemleri bu sayfada topladım.</p>
				</div>

				<div className="profile-actions">
					{aktifKullanici ? (
						<button type="button" className="secondary-button" onClick={onCikisYap}>
							<LogOut size={16} />
							Çıkış Yap
						</button>
					) : (
						<button type="button" className="primary-button" onClick={onGirisAc}>
							<LogIn size={16} />
							Bayi Girişi
						</button>
					)}
					<button type="button" className="secondary-button" onClick={onHome}>
						Ana Sayfa
					</button>
				</div>
			</div>

			<div className="display flex justify-center items-center gap-2 pb-2">
					<div className="col-md-6 w-1/2">
						<article className="profile-summary-card accent-blue">
							<span>Oturum durumu</span>
							<strong>{aktifKullanici ? 'Açık' : 'Kapalı'}</strong>
						</article>
					</div>
					<div className="col-md-6 w-1/2">
						<article className="profile-summary-card accent-green">
							<span>Yerel kayıt</span>
							<strong>{aktifKullanici?.e_ad_soyad || '-'}</strong>
						</article>
					</div>
			</div>

			<div className="profile-list">
				<article className="profile-user-card">
					<div className="display flex justify-start items-center gap-5 pb-5">
						<span className="user-avatar compact"><ShieldCheck size={18} /></span>
						<div>
							<strong>{aktifKullanici ? aktifKullanici.e_ad_soyad : 'Giriş yapılmadı'}</strong>
							<p>{aktifKullanici ? aktifKullanici.e_rol : 'Sisteme bağlanmak için giriş gerekir.'}</p>
						</div>
					</div>

					<dl className="profile-meta-grid">
						<div>
							<dt>E-posta</dt>
							<dd>{aktifKullanici?.e_eposta || '-'}</dd>
						</div>
						<div>
							<dt>Rol</dt>
							<dd>{aktifKullanici?.e_rol || '-'}</dd>
						</div>
					</dl>
				</article>
			</div>
		</section>
	)
}
