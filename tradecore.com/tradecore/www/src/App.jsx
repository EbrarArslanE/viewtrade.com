import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BarChart3, Bell, ChevronDown, Database, LineChart, LogOut, Sparkles, X, ReceiptText, FilePen } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { supabase } from './lib/supabase'
import HomeSayfa from './pages/HomeSayfa.jsx'
import BakiyeBilgileri from './pages/BakiyeBilgileri.jsx'
import OturumBilgileri from './pages/OturumBilgileri.jsx'
import ProfilBilgileri from './pages/ProfilBilgileri.jsx'
import KullaniciListesi from './pages/KullaniciListesi.jsx'
import KullaniciVarliklari from './pages/kullaniciVarliklari.jsx'
import FirmaTanimlari from './pages/FirmaTanimlari.jsx'
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
    oturum: '/oturum',
    bakiye: '/bakiye',
    kullanici: '/kullanici',
    KullaniciVarliklari: '/KullaniciVarliklari',
    FirmaTanimlari: '/FirmaTanimlari',
  }

  function getRouteFromPath(path) {
    const temizPath = path.replace(/^\/+|\/+$/g, '')

    const gecerliRotalar = ['home', 'profil', 'kullanici', 'oturum', 'bakiye', 'KullaniciVarliklari', 'FirmaTanimlari']

    return gecerliRotalar.includes(temizPath) ? temizPath : 'home'
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
        { title: 'Varlık Takibi', desc: 'Varlık Listeniz ve detayları.', path: 'KullaniciVarliklari' },
        { title: 'Firma Tanımları', desc: 'Firma Tanımlarınız ve Daha Fazlası.', path: 'FirmaTanimlari' },
      ],
    },
    {
      id: 'muhasebe',
      label: 'Muhasebe',
      icon: ReceiptText,
      items: [
        { title: 'Faturalar', desc: 'Firmanıza Kesilen Faturalar', path: 'faturalar' },
        { title: 'Fatura Girişi', desc: 'Firmanızın Kestiği Faturalar', path: 'faturaGirisleri' }
        // { title: 'Risk Analizi', desc: 'Alarm ve eşik kontrolleri', path: 'profil' },
        // { title: 'Çıktı Merkezi', desc: 'Dışa aktarma ve paylaşım alanı', path: 'home' },
      ],
    },
  ]

export default function App() {
  const headerRef = useRef(null)
  const [acikMenu, setAcikMenu] = useState(null)
  const [aktifSayfa, setAktifSayfa] = useState(() => getRouteFromPath(window.location.pathname))
  const [modalAcikMi, setModalAcikMi] = useState(false)
  const [eposta, setEposta] = useState('')
  const [sifre, setSifre] = useState('')

  // Başlangıçta localStorage'a bakıyoruz, varsa kullanıcı oturumu otomatik açık geliyor
  const [aktifKullanici, setAktifKullanici] = useState(() => {
    const kayitliKullanici = localStorage.getItem('tradecore_kullanici')
    return kayitliKullanici ? JSON.parse(kayitliKullanici) : null
  })

  useEffect(() => {
    function handleHashChange() {
      setAktifSayfa(getRouteFromPath(window.location.pathname))
    }

    handleHashChange()

    if (!window.location.pathname || window.location.pathname === '/') {
      window.location.pathname = routeMap.home
    }

    window.addEventListener('popstate', handleHashChange)

    return () => {
      window.removeEventListener('popstate', handleHashChange)
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
    const loadingToastId = toast.loading('Giriş verileri yükleniyor, doğrulanıyor...', {
      ...toastOptions,
      autoClose: false,
      closeButton: false,
    })

    try {
      const { data, error } = await supabase.from('KULLANICILAR').select('*').eq('e_eposta', eposta).eq('e_sifre', sifre).limit(1)

      if (error) throw error

      if (!data || data.length === 0) {
        toast.update(loadingToastId, {
          render: 'E-posta veya Şifre hatalı. Lütfen kontrol ediniz.',
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
    window.location.pathname = routeMap.home
    toast.info('Oturum kapatıldı.', toastOptions)
  }

  function navigateTo(route) {
    setAcikMenu(null)
    if (route !=='home' && !aktifKullanici){
      toast.warn('Lütfen önce Bayi Girişi yapınız!', toastOptions)
      return
    }
    window.location.pathname = routeMap[route] || routeMap.home
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

  function handleKullaniciVarliklariAc() {
    navigateTo('KullaniciVarliklari')
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
            <div className="nav-group auth-group">
              <button
                type="button"
                className={`auth-trigger nav-trigger ${acikMenu === 'auth' ? 'active' : ''}`}
                onClick={() => toggleMenu('auth')}
                aria-expanded={acikMenu === 'auth'}
              >
                <span>Giriş</span>
                <ChevronDown size={15} />
              </button>

              <div className={`dropdown-panel dropdown-user dropdown-auth ${acikMenu === 'auth' ? 'open' : ''}`}>
                <button type="button" className="dropdown-item" onClick={() => { setAcikMenu(null); setModalAcikMi(true) }}>
                  <strong>Bayi Girişi</strong>
                  <span>Mevcut hesabınla oturum aç</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => { setAcikMenu(null); setModalAcikMi(true) }}>
                  <strong>Bayi Kaydı Oluştur</strong>
                  <span>Yeni yetkili hesabı aç</span>
                </button>
              </div>
            </div>
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
        {aktifSayfa === 'KullaniciVarliklari' && (
          <KullaniciVarliklari apiBaseUrl={apiBaseUrl} aktifKullanici={aktifKullanici} onHome={handleAnaSayfaAc} />
        )}
        {aktifSayfa === 'FirmaTanimlari' && (
          <FirmaTanimlari apiBaseUrl={apiBaseUrl} aktifKullanici={aktifKullanici} onHome={handleAnaSayfaAc} />
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
                <input type="email" placeholder="example@tradecore.com" value={eposta} onChange={(e) => setEposta(e.target.value)} required />
              </div>

              <div className="field-block">
                <label>Şifre</label>
                <input type="password" placeholder="Şifrenizi girin" value={sifre} onChange={(e) => setSifre(e.target.value)} required />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setModalAcikMi(false)} className="secondary-button" >
                  İptal
                </button>
                <button type="submit" className="primary-button" >
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
