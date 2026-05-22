import React, { useState } from "react";
import { UserProfile } from "../types";
import { BookOpen, User, AtSign, Mail, Lock, ShieldCheck, ArrowRight, CornerDownRight, Landmark, Badge, Eye, EyeOff } from "lucide-react";

interface RegistrationViewProps {
  onAuthSuccess: (profile: Partial<UserProfile>) => void;
  onContinueAsGuest: () => void;
}

export default function RegistrationView({ onAuthSuccess, onContinueAsGuest }: RegistrationViewProps) {
  const [screen, setScreen] = useState<"landing" | "login" | "register">("landing");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [memberIdInput, setMemberIdInput] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !emailOrPhone || !password) {
      setErrorMsg("Harap isi seluruh field wajib.");
      return;
    }
    if (!termsAccepted) {
      setErrorMsg("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }

    const newProfile: Partial<UserProfile> = {
      fullName,
      username: username.toLowerCase().trim().replace(/\s+/g, "_"),
      emailOrPhone,
      status: "AKTIF",
      joinedDate: "21 Mei 2026",
      memberType: memberIdInput ? "Anggota KartaNU" : "Anggota Biasa",
      nia: memberIdInput || "31.71.01.2023." + Math.floor(10000 + Math.random() * 90000),
      city: "Jakarta Pusat",
      coopBalance: 4250000,
    };

    localStorage.setItem("nu_profile", JSON.stringify(newProfile));
    onAuthSuccess(newProfile);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setErrorMsg("Harap isi seluruh field wajib.");
      return;
    }

    // Try finding stored profile
    const saved = localStorage.getItem("nu_profile");
    let profile: Partial<UserProfile> = {};
    if (saved) {
      profile = JSON.parse(saved);
    } else {
      profile = {
        fullName: emailOrPhone.split("@")[0] || "Ahmad Fauzi",
        username: emailOrPhone.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") || "fauzi_ahmad",
        emailOrPhone,
        status: "AKTIF",
        joinedDate: "12 Jan 2021",
        memberType: "Anggota Biasa",
        nia: "31.71.01.2023.00451",
        city: "Jakarta Pusat",
        coopBalance: 4250000,
      };
    }

    onAuthSuccess(profile);
  };

  if (screen === "landing") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 py-6 md:py-8 max-w-xl mx-auto w-full relative overflow-hidden font-sans gap-y-3 md:gap-y-5">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 z-0"></div>
        
        {/* Logo Section */}
        <header className="w-full flex flex-col items-center z-10 animate-fade-in">
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-600/10 rounded-full blur-xl group-hover:bg-emerald-600/20 transition-all duration-500"></div>
            <img 
              alt="Nahdlatul Ulama Logo" 
              className="relative w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-md" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvPNS4KGpFRCJI3vw3Hfq24-6phYQ8BhX6xZWa3ho9qB_Amg3LRtQR5SLccbg9vqBP7WuecM8x0jPG5rCx7Bq1SECUeoFvDMSkfN8cgmZzLtHmE7ARpON4B0E-AjII0OKHA4NiWSlyhjkKjgosbo3FMpsXajdRqhjJv1llLIpLxhXYgrhVziIs8gU2PNA_R1vAEDMJ-G2OZX-n_461BEc86dHGl7jZwL81Fm92PyybYV33p92tl8YY97gtT5cD8ofcjbD29-sHxovV"
            />
          </div>
        </header>

        {/* Welcome Text */}
        <section className="w-full text-center space-y-2 z-10">
          <h1 className="font-extrabold text-xl md:text-2xl text-emerald-900 tracking-tight leading-snug">
            Selamat Datang<br />
            Di Portal Digital<br />
            MWCNU Pondok Aren
          </h1>
          <p className="text-xs md:text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
            Menghubungkan jutaan warga Nahdliyin dalam satu ekosistem digital yang aman, amanah, dan mencerahkan.
          </p>
        </section>

        {/* Action buttons */}
        <footer className="w-full flex flex-col space-y-3 z-10 mt-1 max-w-sm">
          <div className="flex flex-col space-y-2 w-full">
            <button
              onClick={() => {
                setErrorMsg("");
                setScreen("login");
              }}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold h-11 md:h-12 rounded-full transition-all duration-300 shadow-md flex items-center justify-center text-sm active:scale-[0.98]"
            >
              Masuk
            </button>
            <button
              onClick={() => {
                setErrorMsg("");
                setScreen("register");
              }}
              className="w-full bg-white border-2 border-emerald-800 text-emerald-800 hover:bg-emerald-50/50 font-bold h-11 md:h-12 rounded-full transition-colors duration-300 flex items-center justify-center text-sm active:scale-[0.98]"
            >
              Daftar
            </button>
          </div>

          <div className="flex flex-col items-center pt-1 animate-fade-in">
            <button
              onClick={onContinueAsGuest}
              className="text-amber-700 hover:text-amber-800 font-semibold text-xs flex items-center gap-1.5 group transition-colors py-1"
            >
              <span>Lanjutkan sebagai Tamu</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </footer>

        {/* Footer verification indicator */}
        <div className="w-full flex justify-center pt-1 opacity-50 z-10 mt-1">
          <div className="flex items-center gap-2.5">
            <div className="h-[1px] w-8 bg-gray-300"></div>
            <ShieldCheck className="text-emerald-800" size={14} />
            <span className="text-[10px] font-semibold text-emerald-900">Portal Warga Resmi</span>
            <div className="h-[1px] w-8 bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col md:flex-row overflow-x-hidden font-sans">
      {/* Left side banner - visible on desktop/tablet */}
      <section className="hidden md:flex w-1/2 bg-emerald-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <img 
            className="w-full h-full object-cover grayscale brightness-50" 
            alt="Traditional Indonesia Mosque"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM-KB3mas0I3F8c5IFEbN39DW8SGeRXzBnyVN7Qsw1eepjsUbE22XDAdGA9XTzKG1mbxvRoF-rExXgjFuDu3k48x1CLiKs8seiFCEg9fBVYzRxwaq2tmcHjMltLe7P2-JQHuvKykKlzAFFtgAHkk8EVH0k5zqt5IzZBbnNM7Z7OhRv8LmylKYmrNg4nDsYnmPlNMwvLDWuPo4HlbrqVBa8b9GlTYtaB4lm6WbemNx-vZ0F5DmtBV18sN2xruI7Guke_Kx-h-Wvfl8V"
          />
        </div>
        <div className="relative z-10 text-center max-w-md animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#fed65b] mb-4">
            Ekosistem Digital NU
          </h1>
          <p className="text-lg text-emerald-100/90 leading-relaxed mb-6">
            Bergabunglah dalam pengabdian untuk umat dan bangsa melalui ekosistem digital Nahdlatul Ulama yang modern.
          </p>
          <div className="flex justify-center gap-2">
            <span className="w-12 h-1.5 bg-[#fed65b] rounded-full"></span>
            <span className="w-3 h-1.5 bg-emerald-700 rounded-full"></span>
            <span className="w-3 h-1.5 bg-emerald-700 rounded-full"></span>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#fed65b]/5 blur-[120px] rounded-full"></div>
      </section>

      {/* Right side form */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50 relative">
        <div className="w-full max-w-md bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 animate-slide-up">
          {/* Form Header */}
          <div className="mb-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Landmark className="text-emerald-800" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-emerald-990 leading-tight">
              {screen === "register" ? "Buat Akun Baru" : "Masuk Ke Akun"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {screen === "register" 
                ? "Lengkapi data diri Anda untuk memulai perjalanan." 
                : "Selamat Datang Kembali di Portal Digital Warga NU"
              }
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium mb-4">
              {errorMsg}
            </div>
          )}

          {/* Form layout */}
          <form onSubmit={screen === "register" ? handleRegister : handleLogin} className="space-y-4">
            {screen === "register" && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Nama Lengkap
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-800 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ahmad Fauzi"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white focus:ring-0 outline-none transition-all text-sm group-hover:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Username
                  </label>
                  <div className="relative group">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-800 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().trim().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="fauzi_ahmad"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white focus:ring-0 outline-none transition-all text-sm group-hover:border-emerald-700"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                Email atau Nomor Telepon
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-800 transition-colors" size={18} />
                <input
                  required
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="ahmad@domain.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white focus:ring-0 outline-none transition-all text-sm group-hover:border-emerald-700"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Password
                </label>
                {screen === "login" && (
                  <button type="button" className="text-xs font-semibold text-amber-700 hover:underline">
                    Lupa Password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-800 transition-colors" size={18} />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white focus:ring-0 outline-none transition-all text-sm group-hover:border-emerald-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1"
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {screen === "register" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Nomor Anggota (optional)
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Opsional</span>
                </div>
                <div className="relative group">
                  <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-800 transition-colors" size={18} />
                  <input
                    type="text"
                    value={memberIdInput}
                    onChange={(e) => setMemberIdInput(e.target.value)}
                    placeholder="Kartanu-123456"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white focus:ring-0 outline-none transition-all text-sm group-hover:border-emerald-700"
                  />
                </div>
              </div>
            )}

            {screen === "register" ? (
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-emerald-800 focus:ring-0"
                />
                <label htmlFor="terms" className="text-[11px] text-gray-500 leading-normal cursor-pointer select-none">
                  Saya menyetujui <button type="button" className="text-emerald-800 font-bold hover:underline">Syarat & Ketentuan</button> serta <button type="button" className="text-emerald-800 font-bold hover:underline">Kebijakan Privasi</button> yang berlaku di ekosistem digital Nahdlatul Ulama.
                </label>
              </div>
            ) : (
              <div className="pt-2"></div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-full shadow-md hover:shadow-emerald-800/10 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-200 text-sm mt-2 font-semibold"
            >
              {screen === "register" ? "Daftar Sekarang" : "Masuk Ke Anggota"}
            </button>
          </form>

          {/* Form Switcher Footer */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
            {screen === "register" ? (
              <p>
                Sudah punya akun?{" "}
                <button
                  onClick={() => {
                    setErrorMsg("");
                    setScreen("login");
                  }}
                  className="text-emerald-850 font-bold hover:underline transition-all ml-1 text-emerald-800"
                >
                  Masuk
                </button>
              </p>
            ) : (
              <p>
                Belum punya akun?{" "}
                <button
                  onClick={() => {
                    setErrorMsg("");
                    setScreen("register");
                  }}
                  className="text-emerald-850 font-bold hover:underline transition-all ml-1 text-emerald-800"
                >
                  Daftar Sekarang
                </button>
              </p>
            )}
          </div>
        </div>
      </main>


    </div>
  );
}
