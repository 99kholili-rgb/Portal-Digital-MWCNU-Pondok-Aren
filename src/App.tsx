import React, { useState, useEffect } from "react";
import { UserProfile, DuesRecord } from "./types";
import { initialProfile } from "./mockData";
import BerandaView from "./components/BerandaView";
import RegistrationView from "./components/RegistrationView";
import DonasiView from "./components/DonasiView";
import FatwaView from "./components/FatwaView";
import AnggotaView from "./components/AnggotaView";
import TanyaKyaiView from "./components/TanyaKyaiView";
import KoperasiView from "./components/KoperasiView";
import AgendaView from "./components/AgendaView";
import AdminView from "./components/AdminView";
import NotificationCenter from "./components/NotificationCenter";
import { Home, Heart, CreditCard, MessagesSquare, Landmark, BookOpen, Calendar, LogOut, Loader2, ArrowLeft, ShieldAlert, Key, Lock, Unlock } from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const isGuest = profile?.nia === "BUKAN ANGGOTA";
  const [activeTab, setActiveTab] = useState<"beranda" | "zakat" | "anggota" | "kyai" | "fatwa" | "koperasi" | "agenda" | "admin">("beranda");
  const [coopBalance, setCoopBalance] = useState<number>(initialProfile.coopBalance);
  
  // Suggested Questions channel (cross-tab navigation helper)
  const [suggestedQuestion, setSuggestedQuestion] = useState<string>("");

  const [isInitializing, setIsInitializing] = useState(true);

  // States to hide and authorize the Admin view
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem("nu_admin_unlocked") === "true";
  });
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Retrieve user session from local storage on load
  useEffect(() => {
    const saved = localStorage.getItem("nu_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile({
          ...initialProfile,
          ...parsed,
        });
        if (parsed.coopBalance !== undefined) {
          setCoopBalance(parsed.coopBalance);
        }
      } catch (e) {
        setProfile(initialProfile);
      }
    } else {
      // Default to initial profile to make it immediate or let guest proceed
    }
    setIsInitializing(false);
  }, []);

  const handleAuthSuccess = (newProfile: Partial<UserProfile>) => {
    const full = { ...initialProfile, ...newProfile } as UserProfile;
    setProfile(full);
    setCoopBalance(full.coopBalance);
    localStorage.setItem("nu_profile", JSON.stringify(full));
  };

  const handleContinueAsGuest = () => {
    const guest: UserProfile = {
      fullName: "Warga Tamu",
      emailOrPhone: "tamu@domain.com",
      status: "TIDAK AKTIF",
      joinedDate: "21 Mei 2026",
      memberType: "Partisipan",
      nia: "BUKAN ANGGOTA",
      city: "DKI Jakarta",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu6acJ-RbECn45HDXQBnQRGDRuPAUTjaXuiK0cMvpyBOsZu4eWn391CrMRkjPY5O1_sa6hd9LQ1hIy43KSW5Tqz1x0n31qT39ONUFyBKKhZsVbCcnLMUmfurLGSDpGadd3rvtIUCQT3Q0mMxEmj-8HmGBSi0o4d3doiUNOzTU4BVZJZ-JRYZa3xme-PlXEcjuiUPGqnZ9Kjy54A49msfAmqxo2Wq3-1XbhbTP9sd9wQ_E-Sf2LQMnKBQXsHvu35-TQox_3PhjAL3UK",
      coopBalance: 0,
      dues: []
    };
    setProfile(guest);
    setCoopBalance(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("nu_profile");
    setProfile(null);
    setActiveTab("beranda");
  };

  const handleAddTransaction = (amount: number, label: string) => {
    setCoopBalance((prev) => {
      const next = prev - amount;
      if (profile) {
        localStorage.setItem("nu_profile", JSON.stringify({ ...profile, coopBalance: next }));
      }
      return next;
    });
  };

  const handleModifyBalance = (amount: number) => {
    setCoopBalance((prev) => {
      const next = prev + amount;
      if (profile) {
        localStorage.setItem("nu_profile", JSON.stringify({ ...profile, coopBalance: next }));
      }
      return next;
    });
  };

  const handlePayDues = (record: DuesRecord) => {
    if (!profile) return;
    const updatedDues = [record, ...profile.dues];
    const nextBalance = coopBalance - record.amount;
    
    const updatedProfile = {
      ...profile,
      dues: updatedDues,
      coopBalance: nextBalance
    };
    
    setProfile(updatedProfile);
    setCoopBalance(nextBalance);
    localStorage.setItem("nu_profile", JSON.stringify(updatedProfile));
  };

  const handleSuggestQuestionFromFatwa = (qStr: string) => {
    setSuggestedQuestion(qStr);
    setActiveTab("kyai");
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1926") {
      setIsAdminUnlocked(true);
      localStorage.setItem("nu_admin_unlocked", "true");
      setShowPinModal(false);
      setPinInput("");
      setPinError("");
      setActiveTab("admin");
    } else {
      setPinError("PIN Keliru! Petunjuk: Tahun khidmat/berdirinya Nahdlatul Ulama.");
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    localStorage.removeItem("nu_admin_unlocked");
    if (activeTab === "admin") {
      setActiveTab("beranda");
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={32} className="animate-spin text-emerald-800" />
          <span className="text-sm font-semibold text-gray-500">Memuat Portal Digital NU...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <RegistrationView
        onAuthSuccess={handleAuthSuccess}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans flex flex-col md:flex-row relative">
      {/* Desktop left Sidebar navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-emerald-950 text-white shrink-0 p-6 justify-between select-none border-r border-emerald-900">
        <div className="space-y-8">
          {/* Logo container */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-md">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpfdwC4kfpVK903GobcBxnhtWrKD6afVnOUs0xNr8w4D_7WsAqt566B58Q80TGH2b2WfxVV2X3vo_XFgQCkhlKs-LsR1ZQFRuyx2botkGHAgPeIo71G3qzMYfiTIA4BvLoFXhsS_30z0ua-ta3b0CNSq3oqAMbl3XFVPX554Hj7Yr5sPwHmCSkVuhfT6Rsw-F_GxKB6ElFu8GZ9fJh4phHnbG5qZB7I1YkU6T-nrFVpqj0Oh8tCInrtnTTyF84zEAJWn91OzDoE35E"
                alt="NU Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-extrabold text-sm tracking-tight leading-none text-[#fed65b]">Portal NU</p>
              <span className="text-[9px] text-[#fed65b]/50 tracking-widest uppercase">Digital Warga</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("beranda")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "beranda" ? "bg-emerald-800 text-[#fed65b]" : "text-emerald-100 hover:bg-emerald-900/50"
              }`}
            >
              <Home size={16} /> Beranda
            </button>
            
            <button
              onClick={() => setActiveTab("zakat")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "zakat" ? "bg-emerald-800 text-[#fed65b]" : "text-emerald-100 hover:bg-emerald-900/50"
              }`}
            >
              <Heart size={16} /> Zakat & Sedekah
            </button>

            {!isGuest && (
              <button
                onClick={() => setActiveTab("anggota")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "anggota" ? "bg-emerald-800 text-[#fed65b]" : "text-emerald-100 hover:bg-emerald-900/50"
                }`}
              >
                <CreditCard size={16} /> Kartu Anggota
              </button>
            )}

            <button
              onClick={() => setActiveTab("kyai")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "kyai" ? "bg-emerald-800 text-[#fed65b]" : "text-emerald-100 hover:bg-emerald-900/50"
              }`}
            >
              <MessagesSquare size={16} /> Tanya Kyai
            </button>

            {!isGuest && (
              <button
                onClick={() => setActiveTab("koperasi")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "koperasi" ? "bg-emerald-800 text-[#fed65b]" : "text-emerald-100 hover:bg-emerald-900/50"
                }`}
              >
                <Landmark size={16} /> Koperasi Warga
              </button>
            )}

            <button
              onClick={() => setActiveTab("fatwa")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "fatwa" ? "bg-emerald-800 text-[#fed65b]" : "text-emerald-100 hover:bg-emerald-900/50"
              }`}
            >
              <BookOpen size={16} /> Layanan Fatwa
            </button>

            <button
              onClick={() => setActiveTab("agenda")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "agenda" ? "bg-emerald-800 text-[#fed65b]" : "text-emerald-100 hover:bg-emerald-900/50"
              }`}
            >
              <Calendar size={16} /> Agenda Acara
            </button>

            {isAdminUnlocked && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all border border-amber-500/20 ${
                  activeTab === "admin" ? "bg-amber-500 text-emerald-950 font-black shadow-md shadow-amber-500/10" : "text-amber-300 bg-amber-500/5 hover:bg-amber-500/10"
                }`}
              >
                <ShieldAlert size={16} className={activeTab === "admin" ? "text-emerald-950" : "text-amber-400"} />
                <span>Admin Pengelola</span>
              </button>
            )}
          </nav>
        </div>

        {/* Footer Logout info */}
        <div className="space-y-4 pt-6 mt-6 border-t border-emerald-920">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500 bg-white">
                <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate">{profile.fullName}</p>
                <span className="text-[9px] text-[#fed65b] font-bold block truncate">{profile.nia}</span>
              </div>
            </div>
            {/* Tombol gembok kecil/faint untuk memicu modal PIN rahasia pengelola */}
            <button 
              onClick={() => isAdminUnlocked ? handleLockAdmin() : setShowPinModal(true)}
              title={isAdminUnlocked ? "Kunci Akses Admin Utama" : "Akses Pengurus PWNU"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isAdminUnlocked ? "text-amber-400 bg-amber-500/15 hover:bg-amber-500/25" : "text-emerald-500/30 hover:text-[#fed65b] hover:bg-emerald-900/55"
              }`}
            >
              {isAdminUnlocked ? <Unlock size={11} /> : <Key size={11} />}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-emerald-900/40 hover:bg-rose-950/40 hover:text-rose-250 hover:text-red-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-bold text-xs"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-6 overflow-y-auto no-scrollbar md:py-10 bg-white md:bg-transparent min-h-screen">
        {/* Desktop Header Top bar */}
        <div className="hidden md:flex justify-between items-center mb-6 pb-4 border-b border-gray-105">
          <div>
            <h1 className="text-sm font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
              Layanan {activeTab === "kyai" ? "Tanya Kyai" : activeTab === "zakat" ? "Zakat & Sedekah" : activeTab === "anggota" ? "Kartu Anggota" : activeTab === "koperasi" ? "Koperasi Syariah" : activeTab === "fatwa" ? "Layanan Fatwa" : activeTab === "agenda" ? "Agenda Acara" : activeTab === "admin" ? "Admin Pengelola" : "Beranda Utama"}
            </h1>
            <p className="text-[9px] text-gray-400 font-extrabold tracking-widest select-none mt-0.5">BISMILLAHIRROHMANIRROHIM • PORTAL WARGA DIGITAL</p>
          </div>
          <NotificationCenter profile={profile} isAdminMode={isAdminUnlocked} />
        </div>

        {/* Top bar showing current view name of mobile */}
        <div className="md:hidden flex justify-between items-center mb-4 select-none">
          <div 
            className="flex items-center gap-1.5 cursor-pointer" 
            onClick={() => setActiveTab("beranda")}
          >
            <div 
              className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center overflow-hidden p-1 shadow-sm active:scale-95 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setShowPinModal(true);
              }}
              title="Akses Pengurus"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpfdwC4kfpVK903GobcBxnhtWrKD6afVnOUs0xNr8w4D_7WsAqt566B58Q80TGH2b2WfxVV2X3vo_XFgQCkhlKs-LsR1ZQFRuyx2botkGHAgPeIo71G3qzMYfiTIA4BvLoFXhsS_30z0ua-ta3b0CNSq3oqAMbl3XFVPX554Hj7Yr5sPwHmCSkVuhfT6Rsw-F_GxKB6ElFu8GZ9fJh4phHnbG5qZB7I1YkU6T-nrFVpqj0Oh8tCInrtnTTyF84zEAJWn91OzDoE35E"
                alt=""
                className="w-full h-full object-contain filter invert"
              />
            </div>
            <span className="text-[13px] font-extrabold text-[#00450d] tracking-wide">Portal Digital NU</span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter profile={profile} isAdminMode={isAdminUnlocked} />
            {isAdminUnlocked ? (
              <button
                onClick={() => setActiveTab("admin")}
                className="text-xs font-extrabold bg-amber-400 hover:bg-amber-500 text-amber-950 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs border border-amber-300 animate-scale-up"
              >
                <ShieldAlert size={11} /> Admin
              </button>
            ) : (
              // Invisible tiny tap target next to Keluar for mobile simulation admins
              <button 
                onClick={() => setShowPinModal(true)}
                className="p-1 text-emerald-900/10 hover:text-emerald-950 transition-colors"
                title="PIN"
              >
                <Key size={10} />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-xs font-extrabold text-rose-700 hover:underline flex items-center gap-1"
            >
              Keluar <LogOut size={12} />
            </button>
          </div>
        </div>

        {/* Tab view routing switchboard */}
        <section className="min-h-[75vh]">
          {activeTab !== "beranda" && (
            <div className="mb-5">
              <button
                onClick={() => setActiveTab("beranda")}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer hover:shadow-sm"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          )}
          {activeTab === "beranda" && (
            <BerandaView profile={profile} onChangeTab={setActiveTab} coopBalance={coopBalance} />
          )}
          {activeTab === "zakat" && (
            <DonasiView onAddTransaction={handleAddTransaction} coopBalance={coopBalance} profile={profile} />
          )}
          {activeTab === "anggota" && (
            <AnggotaView profile={profile} onPayDues={handlePayDues} coopBalance={coopBalance} />
          )}
          {activeTab === "kyai" && (
            <TanyaKyaiView
              initialQuestion={suggestedQuestion}
              onClearInitialQuestion={() => setSuggestedQuestion("")}
            />
          )}
          {activeTab === "fatwa" && (
            <FatwaView onSuggestQuestion={handleSuggestQuestionFromFatwa} />
          )}
          {activeTab === "koperasi" && (
            <KoperasiView
              coopBalance={coopBalance}
              onPurchase={handleAddTransaction}
              onModifyBalance={handleModifyBalance}
              profile={profile}
            />
          )}
          {activeTab === "agenda" && (
            <AgendaView />
          )}
          {activeTab === "admin" && (
            <AdminView
              coopBalance={coopBalance}
              onModifyBalance={handleModifyBalance}
              currentUserProfile={profile}
            />
          )}
        </section>
      </main>

      {/* Mobile Bottom navigation bar */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around py-3.5 px-2 z-40 select-none shadow-lg">
        <button
          onClick={() => setActiveTab("beranda")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "beranda" ? "text-[#00450d]" : "text-gray-400 hover:text-gray-900"
          }`}
        >
          <Home size={18} className={activeTab === "beranda" ? "scale-110" : "scale-100"} />
          <span className="text-[9px] font-extrabold font-sans">Beranda</span>
        </button>

        <button
          onClick={() => setActiveTab("zakat")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "zakat" ? "text-[#00450d]" : "text-gray-400 hover:text-gray-900"
          }`}
        >
          <Heart size={18} className={activeTab === "zakat" ? "scale-110" : "scale-100"} />
          <span className="text-[9px] font-extrabold font-sans">Zakat</span>
        </button>

        <button
          onClick={() => setActiveTab("kyai")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "kyai" ? "text-[#00450d]" : "text-gray-400 hover:text-gray-900"
          }`}
        >
          <MessagesSquare size={18} className={activeTab === "kyai" ? "scale-110" : "scale-100"} />
          <span className="text-[9px] font-extrabold font-sans">Tanya Kyai</span>
        </button>

        {!isGuest && (
          <button
            onClick={() => setActiveTab("anggota")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "anggota" ? "text-[#00450d]" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            <CreditCard size={18} className={activeTab === "anggota" ? "scale-110" : "scale-100"} />
            <span className="text-[9px] font-extrabold font-sans">KartaNU</span>
          </button>
        )}

        {!isGuest && (
          <button
            onClick={() => setActiveTab("koperasi")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "koperasi" ? "text-[#00450d]" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            <Landmark size={18} className={activeTab === "koperasi" ? "scale-110" : "scale-100"} />
            <span className="text-[9px] font-extrabold font-sans">Koperasi</span>
          </button>
        )}
      </footer>

      {/* Dialog PIN Modal untuk Pengamanan Admin Pengelola */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[200] flex items-center justify-center p-4">
          <form 
            onSubmit={handleVerifyPin} 
            className="bg-white rounded-[28px] max-w-xs w-full p-6 space-y-4 shadow-2xl relative border border-emerald-100 animate-scale-up"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-100 shadow-xs">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-widest">Akses Pengurus PWNU</h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-1">Masukkan sandi khusus pengelola untuk mengaktifkan Workspace Admin.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <input
                required
                autoFocus
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                placeholder="PIN Pengurus..."
                className="w-full text-center bg-gray-50 border border-gray-200 py-2.5 rounded-xl font-mono text-base tracking-widest outline-none focus:border-emerald-800 transition-all font-black text-gray-800"
              />
              <p className="text-[9px] text-amber-700 text-center font-semibold italic bg-amber-50/70 p-1.5 rounded-lg border border-amber-100">
                Petunjuk: Tahun berdirinya NU (4 digit)
              </p>
            </div>

            {pinError && (
              <p className="text-[9px] text-rose-700 text-center font-bold px-2 py-1 bg-rose-50 rounded-lg leading-tight border border-rose-100">
                {pinError}
              </p>
            )}

            <div className="flex gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput("");
                  setPinError("");
                }}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-extrabold rounded-xl transition-colors cursor-pointer text-center border border-gray-150"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-xs text-center"
              >
                Konfirmasi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
