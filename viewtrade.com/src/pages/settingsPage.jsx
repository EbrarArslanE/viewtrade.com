import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // 🍏 LocalStorage State'i
  const [userData, setUserData] = useState({
    tc: '',
    name: '',
    email: '',
    username: '',
    phone: '',
    birthDate: '',
    // Güvenlik & Arayüz ayarları
    // apiKey: '',
    // secretKey: '',
    // theme: 'dark',
    // chartStyle: 'candlestick',
    // emailNotify: true,
    // tradeAlerts: true
  });

  // Sayfa açıldığında LS'den bilgileri çek
  useEffect(() => {
  const saved = localStorage.getItem("viewtrade_user");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setUserData({
        tc: parsed.tc || '',
        name: parsed.name || '',
        username: parsed.username || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        birthDate: parsed.birthDate || ''
      });
    } catch (err) {
      console.error("LS okunurken hata oluştu", err);
    }
  }
}, []);

  // Input değişimlerini yönet
  const handleChange = (key, val) => {
    setUserData(prev => ({ ...prev, [key]: val }));
  };

  // Ayarları kaydet
  const handleSave = () => {
    localStorage.setItem("viewtrade_user", JSON.stringify(userData));
    toast.success("Sistem konfigürasyonu başarıyla güncellendi!", {
      theme: "dark",
      position: "top-right"
    });
  };

  // Ad Soyad'dan Avatar Başharflerini Çıkarma (Örn: Ebrar Arslan -> EA)
  const getInitials = (name) => {
    if (!name) return 'VT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // 🍏 Terminal Stili Controlled Input Bileşeni
  const TerminalInput = ({ label, value, onChange, type = "text", placeholder, readOnly = false }) => (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase ml-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`bg-[#0B1120] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-white/10 ${
          readOnly
            ? 'border-white/5 opacity-50 cursor-not-allowed'
            : 'border-white/5 focus:border-emerald-500/50'
        }`}
      />
    </div>
  );

  // 🍏 Terminal Switcher (Toggle) Bileşeni
  const TerminalToggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-[#0B1120] border border-white/5 rounded-2xl">
      <div>
        <h5 className="text-sm font-bold text-white">{label}</h5>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
          checked ? 'bg-emerald-500 justify-end' : 'bg-white/10 justify-start'
        }`}
      >
        <div className="w-4 h-4 rounded-full bg-[#0B1120] shadow-md" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1d1e] text-slate-100 p-10 font-cyber-clean relative overflow-hidden">
      {/* Arka Plan Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-2">SİSTEM <span className="text-emerald-400">AYARLARI</span></h1>
          <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">
            Terminal Configuration // User ID: #{userData.tc ? userData.tc.slice(-5) : '00000'}
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Sol Menü */}
          <div className="col-span-12 lg:col-span-3 space-y-2">
            {[
              { id: 'profile', label: 'Profil Bilgileri', icon: 'fa-user' },
              { id: 'security', label: 'Güvenlik & API', icon: 'fa-shield-alt' },
              { id: 'ui', label: 'Arayüz (UI/UX)', icon: 'fa-palette' },
              { id: 'notifications', label: 'Bildirimler', icon: 'fa-bell' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all text-[11px] font-black tracking-widest uppercase ${
                  activeTab === item.id
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'
                }`}
              >
                <i className={`fas ${item.icon}`}></i>
                {item.label}
              </button>
            ))}
          </div>

          {/* Sağ İçerik Paneli */}
          <div className="col-span-12 lg:col-span-9 bg-[#0B1120]/50 border border-white/5 rounded-[32px] p-10 backdrop-blur-xl shadow-2xl">

            {/* TAB 1: PROFİL */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/5">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-blue-600 p-[2px]">
                    <div className="w-full h-full bg-[#0B1120] rounded-3xl flex items-center justify-center overflow-hidden">
                      <span className="text-2xl font-black text-emerald-400 uppercase">
                        {getInitials(userData.name)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{userData.name || "Kullanıcı Hesabı"}</h3>
                    <p className="text-gray-500 text-xs mt-1 italic">@{userData.username || "kullanici"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TerminalInput
                    label="T.C. Kimlik No (Değiştirilemez)"
                    value={userData.tc}
                    readOnly={true}
                  />
                  <TerminalInput
                    label="Ad Soyad"
                    value={userData.name}
                    onChange={(val) => handleChange('name', val)}
                    placeholder="Ad Soyad giriniz..."
                  />
                  <TerminalInput
                    label="Kullanıcı Adı"
                    value={userData.username}
                    onChange={(val) => handleChange('username', val)}
                    placeholder="kullanici_adi"
                  />
                  <TerminalInput
                    label="E-Posta Adresi"
                    value={userData.email}
                    onChange={(val) => handleChange('email', val)}
                    placeholder="ornek@viewtrade.com"
                  />
                  <TerminalInput
                    label="Telefon"
                    value={userData.phone}
                    onChange={(val) => handleChange('phone', val)}
                    placeholder="+90 5XX XXX XX XX"
                  />
                  <TerminalInput
                    label="Doğum Tarihi"
                    type="date"
                    value={userData.birthDate}
                    onChange={(val) => handleChange('birthDate', val)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: GÜVENLİK */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl mb-6">
                  <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle"></i> DİKKAT: API ERİŞİMİ
                  </h4>
                  <p className="text-[11px] text-red-400/70">
                    API anahtarlarınızı asla üçüncü şahıslarla paylaşmayın. ViewTrade simülasyon olsa da güvenliğiniz bizim için önceliklidir.
                  </p>
                </div>

                <TerminalInput
                  label="Binance API Key"
                  value={userData.apiKey}
                  onChange={(val) => handleChange('apiKey', val)}
                  placeholder="Binance API Key ekleyin..."
                />
                <TerminalInput
                  label="Secret Key"
                  type="password"
                  value={userData.secretKey}
                  onChange={(val) => handleChange('secretKey', val)}
                  placeholder="Secret Key ekleyin..."
                />
              </div>
            )}

            {/* TAB 3: ARAYÜZ (UI/UX) */}
            {activeTab === 'ui' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Terminal Teması ve Grafikler</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase ml-1">Grafik Tipi</label>
                    <select
                      value={userData.chartStyle}
                      onChange={(e) => handleChange('chartStyle', e.target.value)}
                      className="bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="candlestick">Mum Grafik (Candlestick)</option>
                      <option value="line font-bold">Çizgi Grafik (Line)</option>
                      <option value="area">Alan Grafik (Area)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase ml-1">Renk Teması</label>
                    <select
                      value={userData.theme}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      className="bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="dark">Cyber Dark (Varsayılan)</option>
                      <option value="midnight">Midnight Blue</option>
                      <option value="oled">Pure OLED Black</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BİLDİRİMLER */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Sistem & İşlem Alarmları</h4>

                <TerminalToggle
                  label="E-Posta Bildirimleri"
                  description="Aylık işlem özetleri ve hesap güvenliği bildirimlerini al."
                  checked={userData.emailNotify}
                  onChange={(val) => handleChange('emailNotify', val)}
                />

                <TerminalToggle
                  label="Anlık Fiyat & Emir Alarmları"
                  description="Emir gerçekleştiğinde veya stop-loss çalıştığında ekran bildirimi göster."
                  checked={userData.tradeAlerts}
                  onChange={(val) => handleChange('tradeAlerts', val)}
                />
              </div>
            )}

            {/* Alt Butonlar */}
            <div className="mt-12 pt-8 border-t border-white/5 flex justify-end gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest text-gray-400 hover:bg-white/10 transition-all"
              >
                İPTAL ET
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-emerald-500 text-[#020617] rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                SİSTEMİ GÜNCELLE
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
