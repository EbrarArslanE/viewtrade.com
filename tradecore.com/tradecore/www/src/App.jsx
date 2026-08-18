import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BarChart3, Bell, ChevronDown, Database, LineChart, LogOut, Sparkles, X } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { supabase } from './lib/supabase'
import HomeSayfa from './pages/HomeSayfa.jsx'
import BakiyeBilgileri from './pages/BakiyeBilgileri.jsx'
import OturumBilgileri from './pages/OturumBilgileri.jsx'
import ProfilBilgileri from './pages/ProfilBilgileri.jsx'
import KullaniciListesi from './pages/KullaniciListesi.jsx'
import './App.css'

const toastOptions = {
  position: 'top-right',
  autoClose: 2800,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
  icon: false,
  className: 'tradecore-toast',
  bodyClassName: 'tradecore-toast-body',
  progressClassName: 'tradecore-toast-progress',
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const routeMap = {
    home: '/home',
    profil: '/profil',
    kullanici: '/kullanici',
    oturum: '/oturum',
    bakiye: '/bakiye',
  }

  function getRouteFromHash(hash) {
    const temizHash = hash.replace(/^#\/?/, '')

    if (temizHash === '' || temizHash === 'home') return 'home'
    if (temizHash === 'profil') return 'profil'
    if (temizHash === 'kullanici') return 'kullanici'
    if (temizHash === 'oturum') return 'oturum'
    if (temizHash === 'bakiye') return 'bakiye'

    return 'home'
  }

  const headerMenus = [
    {
      id: 'piyasa',
      label: 'Piyasalar',
      icon: BarChart3,
      items: [
        { title: 'Canlı USD / USDT', desc: 'Kur akışını ve volatiliteyi izle', path: 'home' },
        { title: 'Coin Piyasası', desc: 'Kritik coin göstergelerini aç', path: 'home' },
      ],
    },
    {
      id: 'operasyon',
      label: 'Operasyon',
      icon: Database,
      items: [
        { title: 'Sipariş Takibi', desc: 'Aktif iş ve teslimat akışları', path: 'bakiye' },
        { title: 'Kullanıcı Takibi', desc: 'Sistem Kullanıcılarının Listesi', path: 'kullanici' }, // -> doğrudan 'kullanici' rotasına gider!
        { title: 'PDF Modülleri', desc: 'Fatura ve teklif şablonları', path: 'home' },
      ],
    },
    {
      id: 'raporlar',
      label: 'Raporlar',
      icon: LineChart,
      items: [
        { title: 'Günlük Özet', desc: 'Kapanış raporu ve değişim özeti', path: 'oturum' },
        { title: 'Risk Analizi', desc: 'Alarm ve eşik kontrolleri', path: 'profil' },
        { title: 'Çıktı Merkezi', desc: 'Dışa aktarma ve paylaşım alanı', path: 'home' },
      ],
    },
  ]

export default function App() {
  const headerRef = useRef(null)
  const [acikMenu, setAcikMenu] = useState(null)
  const [aktifSayfa, setAktifSayfa] = useState(() => getRouteFromHash(window.location.hash))
  const [modalAcikMi, setModalAcikMi] = useState(false)
  const [eposta, setEposta] = useState('')

  // Başlangıçta localStorage'a bakıyoruz, varsa kullanıcı oturumu otomatik açık geliyor
  const [aktifKullanici, setAktifKullanici] = useState(() => {
    const kayitliKullanici = localStorage.getItem('tradecore_kullanici')
    return kayitliKullanici ? JSON.parse(kayitliKullanici) : null
  })

  useEffect(() => {
    function handleHashChange() {
      setAktifSayfa(getRouteFromHash(window.location.hash))
    }

    handleHashChange()

    if (!window.location.hash) {
      window.location.hash = routeMap.home
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    if (!acikMenu) return undefined

    function handleDisClick(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setAcikMenu(null)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setAcikMenu(null)
      }
    }

    document.addEventListener('mousedown', handleDisClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDisClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [acikMenu])

  // Giriş yapma fonksiyonu
  async function handleGirisYap(e) {
    e.preventDefault()
    const loadingToastId = toast.loading('Mermiler yükleniyor, doğrulanıyor...', {
      ...toastOptions,
      autoClose: false,
      closeButton: false,
    })

    try {
      const { data, error } = await supabase.from('KULLANICILAR').select('*').eq('e_eposta', eposta).limit(1)

      if (error) throw error

      if (!data || data.length === 0) {
        toast.update(loadingToastId, {
          render: 'Bu e-posta ile kayıtlı yetkili bulunamadı.',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
          closeButton: false,
        })
        return
      }

      const kullanici = data[0]
      setAktifKullanici(kullanici)

      // Kullanıcıyı tarayıcı hafızasına sabitliyoruz (Sayfa yenilense de düşmez!)
      localStorage.setItem('tradecore_kullanici', JSON.stringify(kullanici))

      toast.update(loadingToastId, {
        render: `Hoş geldiniz, aktarılıyorsunuz. ${kullanici.e_ad_soyad}!`,
        type: 'success',
        isLoading: false,
        autoClose: 1800,
        closeButton: false,
      })

      setTimeout(() => {
        setModalAcikMi(false)
      }, 1500)

    } catch (err) {
      console.error('Supabase Hatası:', err)
      toast.update(loadingToastId, {
        render: 'Sistem hatası: ' + err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3500,
        closeButton: false,
      })
    }
  }

  // Çıkış (Logout) fonksiyonu ekleyelim ki test edebilesin
  function handleCikisYap() {
    setAktifKullanici(null)
    localStorage.removeItem('tradecore_kullanici')
    setAcikMenu(null)
    window.location.hash = routeMap.home
    toast.info('Oturum kapatıldı.', toastOptions)
  }

  function navigateTo(route) {
    setAcikMenu(null)
    if (route !=='home' && !aktifKullanici){
      toast.warn('Lütfen önce Bayi Girişi yapınız!', toastOptions)
      return
    }
    window.location.hash = routeMap[route] || routeMap.home
  }

  function toggleMenu(menuId) {
    setAcikMenu((onceki) => (onceki === menuId ? null : menuId))
  }

  function handleMenuItemClick() {
    setAcikMenu(null)
  }

  function handleAnaSayfaAc() {
    navigateTo('home')
  }

  function handleProfilAc() {
    navigateTo('profil')
  }

  function handleOturumAc() {
    navigateTo('oturum')
  }

  function handleBakiyeAc() {
    navigateTo('bakiye')
  }

  function handleKullaniciListesiAc() {
    navigateTo('kullanici')
  }

  function handleMenuSelect(hedefModul) {
    setAcikMenu(null) // Menüyü kapat

    // KONTROL: Kullanıcı giriş yapmamışsa engelle!
    if (!aktifKullanici) {
      toast.warn('Lütfen önce Bayi Girişi yapınız!', toastOptions)
      setModalAcikMi(true) // Login modalını ekrana fırlat
      return
    }

    if (hedefModul) {
      navigateTo(hedefModul) // Kullanıcı varsa yönlendir
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* 1. HEADER (ÜST MENÜ) */}
      <header ref={headerRef} className="topbar">
        <div className="brand-block">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <h1>TradeCore</h1>
          </div>
        </div>

        <nav className="topnav" aria-label="Ana menü">
          {headerMenus.map((menu) => {
            const Icon = menu.icon

            return (
              <div key={menu.id} className="nav-group">
                <button type="button" className={`nav-trigger ${acikMenu === menu.id ? 'active' : ''}`} onClick={() => toggleMenu(menu.id)} aria-expanded={acikMenu === menu.id} >
                  <Icon size={16} />
                  <span>{menu.label}</span>
                  <ChevronDown size={15} />
                </button>

                <div className={`dropdown-panel ${acikMenu === menu.id ? 'open' : ''}`}>
                  {menu.items.map((item) => (
                    <button key={item.title} type="button" className="dropdown-item" onClick={() => handleMenuSelect(item.path)} >
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="topbar-actions">
          <div className="status-pill">
            <Bell size={15} />
            <span>Canlı Akış Aktif</span>
          </div>

          {aktifKullanici ? (
            <div className="user-group" >
              <button type="button" className={`user-trigger ${acikMenu === 'kullanici' ? 'active' : ''}`} onClick={() => toggleMenu('kullanici')} aria-expanded={acikMenu === 'kullanici'} >
                <span className="user-avatar">{(aktifKullanici.e_ad_soyad || 'T')[0]}</span>
                <span className="user-meta">
                  <strong>{aktifKullanici.e_ad_soyad}</strong>
                  <small>{aktifKullanici.e_rol}</small>
                </span>
                <ChevronDown size={15} />
              </button>

              <div className={`dropdown-panel dropdown-user ${acikMenu === 'kullanici' ? 'open' : ''}`}>
                <button type="button" className="dropdown-item" onClick={handleProfilAc}>
                  <strong>Profil</strong>
                </button>
                <button type="button" className="dropdown-item" onClick={handleOturumAc}>
                  <strong>Oturum</strong>
                </button>
                <button type="button" className="dropdown-item" onClick={handleBakiyeAc}>
                  <strong>Bakiye Bilgileri</strong>
                </button>
                <button type="button" className="dropdown-item danger" onClick={handleCikisYap}>
                  <LogOut size={15} />
                  <strong>Çıkış Yap</strong>
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setModalAcikMi(true)} className="login-button" type="button" >
              Bayi Girişi
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </header>

      <main className="content-wrap">
        {aktifSayfa === 'home' && <HomeSayfa />}
        {aktifSayfa === 'profil' && (
          <ProfilBilgileri apiBaseUrl={apiBaseUrl} aktifKullanici={aktifKullanici} onHome={handleAnaSayfaAc} />
        )}
        {aktifSayfa === 'kullanici' && (
          <KullaniciListesi apiBaseUrl={apiBaseUrl} aktifKullanici={aktifKullanici} onHome={handleAnaSayfaAc} />
        )}
        {aktifSayfa === 'bakiye' && (
          <BakiyeBilgileri apiBaseUrl={apiBaseUrl} aktifKullanici={aktifKullanici} onHome={handleAnaSayfaAc} />
        )}
        {aktifSayfa === 'oturum' && (
          <OturumBilgileri aktifKullanici={aktifKullanici} onGirisAc={() => setModalAcikMi(true)} onCikisYap={handleCikisYap} onHome={handleAnaSayfaAc} />
        )}
      </main>
      <ToastContainer />
      {modalAcikMi && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <div>
                <span className="eyebrow">Yetkili erişim</span>
                <h3>Bayi / Yetkili Girişi</h3>
              </div>
              <button onClick={() => setModalAcikMi(false)} className="icon-button" type="button">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGirisYap} className="login-form">
              <div className="field-block">
                <label>E-posta Adresi</label>
                <input
                  type="email"
                  placeholder="ebrar.arslan@eronyazilim.com"
                  value={eposta}
                  onChange={(e) => setEposta(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setModalAcikMi(false)}
                  className="secondary-button"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="primary-button"
                >
                  Doğrula & Gir
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
