import React, { useState } from 'react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // 🍏 Terminal Stili Input Bileşeni
  const TerminalInput = ({ label, value, type = "text", placeholder }) => (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase ml-1">{label}</label>
      <input 
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1d1e] text-slate-100 p-10 font-cyber-clean">
      {/* Arka Plan Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a1d1e] blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-2">SİSTEM <span className="text-emerald-400">AYARLARI</span></h1>
          <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">Terminal Configuration // User ID: #88219</p>
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
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/5">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-blue-600 p-[2px]">
                    <div className="w-full h-full bg-[#0B1120] rounded-3xl flex items-center justify-center overflow-hidden">
                      <i className="fas fa-user text-3xl text-emerald-400 opacity-50"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Kullanıcı Hesabı</h3>
                    <p className="text-gray-500 text-xs mt-1 italic">Profil fotoğrafı yüklemek için terminale sürükleyin.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TerminalInput label="Ad Soyad" value="Ebrar Arslan" />
                  <TerminalInput label="E-Posta Adresi" value="ebrar@viewtrade.com" />
                  <TerminalInput label="Kullanıcı Adı" value="ebrar_dev" />
                  <TerminalInput label="Telefon" placeholder="+90 5XX XXX XX XX" />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl mb-6">
                  <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle"></i> DİKKAT: API ERİŞİMİ
                  </h4>
                  <p className="text-[11px] text-red-400/70">API anahtarlarınızı asla üçüncü şahıslarla paylaşmayın. ViewTrade simülasyon olsa da güvenliğiniz bizim için önceliklidir.</p>
                </div>
                
                <TerminalInput label="Mevcut Şifre" type="password" />
                <TerminalInput label="Binance API Key" value="************************" />
                <TerminalInput label="Secret Key" type="password" value="************************" />
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-white/5 flex justify-end gap-4">
              <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest text-gray-400 hover:bg-white/10 transition-all">DEĞİŞİKLİKLERİ İPTAL ET</button>
              <button className="px-8 py-3 bg-emerald-500 text-[#020617] rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">SİSTEMİ GÜNCELLE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;