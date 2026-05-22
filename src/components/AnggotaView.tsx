import React, { useState, useRef } from "react";
import { UserProfile, DuesRecord } from "../types";
import { Verified, History, Edit, Download, Share2, CheckCircle, Navigation, QrCode } from "lucide-react";

interface AnggotaViewProps {
  profile: UserProfile;
  onPayDues: (record: DuesRecord) => void;
  coopBalance: number;
}

export default function AnggotaView({ profile, onPayDues, coopBalance }: AnggotaViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [payingMonth, setPayingMonth] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [showEditName, setShowEditName] = useState(false);
  const [editNameVal, setEditNameVal] = useState(profile.fullName);
  const [editUsernameVal, setEditUsernameVal] = useState(profile.username || "");
  const [duesMethod, setDuesMethod] = useState<"saldo" | "bank_transfer">("saldo");
  const [duesStatus, setDuesStatus] = useState<"idle" | "success" | "failed">("idle");
  const [duesConfirmChecked, setDuesConfirmChecked] = useState(false);
  const [duesErrorMessage, setDuesErrorMessage] = useState("");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 50, y: 50 }); // Reset to center
  };

  const payNextDues = () => {
    const months = [
      "September 2023", "Oktober 2023", "November 2023", 
      "Desember 2023", "Januari 2024", "Februari 2024"
    ];
    
    // Find the next month that is not paid yet
    const paidMonths = profile.dues.map(d => d.monthYear);
    const nextMonth = months.find(m => !paidMonths.includes(m)) || "Maret 2024";

    setDuesStatus("idle");
    setDuesMethod("bank_transfer");
    setDuesConfirmChecked(false);
    setDuesErrorMessage("");
    setPayingMonth(nextMonth);
  };

  const confirmDuesPayment = () => {
    if (!payingMonth) return;
    
    if (duesMethod === "saldo" && coopBalance < 10000) {
      setDuesErrorMessage("Saldo Koperasi Anda tidak mencukupi untuk melakukan pembayaran iuran Rp 10.000.");
      setDuesStatus("failed");
      return;
    }

    const randomRef = "NU-" + Math.floor(100000 + Math.random() * 900000);
    const newRecord: DuesRecord = {
      monthYear: payingMonth,
      ref: randomRef,
      amount: 10000,
      method: duesMethod === "saldo" ? "Koperasi Digital" : "Bank MWCNU BSI",
      status: "LUNAS",
    };

    onPayDues(newRecord);
    setDuesStatus("success");
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Kartu Anggota Card Section */}
      <section className="space-y-4">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #1b5e20 0%, #00450d 100%)`
          }}
          className="rounded-[28px] p-6 text-white shadow-xl relative border border-emerald-500/30 overflow-hidden min-h-[220px] transition-transform duration-500 hover:scale-[1.01] select-none"
        >
          {/* Subtle star pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffe088_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          {/* Card Top Row */}
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center p-1.5 shadow-inner">
                <img
                  alt="Official logo of Nahdlatul Ulama"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpfdwC4kfpVK903GobcBxnhtWrKD6afVnOUs0xNr8w4D_7WsAqt566B58Q80TGH2b2WfxVV2X3vo_XFgQCkhlKs-LsR1ZQFRuyx2botkGHAgPeIo71G3qzMYfiTIA4BvLoFXhsS_30z0ua-ta3b0CNSq3oqAMbl3XFVPX554Hj7Yr5sPwHmCSkVuhfT6Rsw-F_GxKB6ElFu8GZ9fJh4phHnbG5qZB7I1YkU6T-nrFVpqj0Oh8tCInrtnTTyF84zEAJWn91OzDoE35E"
                />
              </div>
              <div>
                <p className="text-[#ffe088] text-[9px] font-bold uppercase tracking-widest opacity-80">
                  Kartu Anggota Digital
                </p>
                <p className="font-extrabold text-sm tracking-tight leading-none mt-0.5">Nahdlatul Ulama</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
              <span className="text-[10px] text-[#ffe088] font-bold">Masa Aktif: Seumur Hidup</span>
            </div>
          </div>

          {/* Card Center Content */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-end relative z-10">
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 justify-center sm:justify-start">
                <span>{profile.fullName}</span>
                {profile.username && (
                  <span className="text-[11px] font-medium text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs select-all text-center self-center sm:self-auto font-mono leading-none">
                    @{profile.username}
                  </span>
                )}
              </h3>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-200">
                <Navigation size={12} className="rotate-45" />
                <span className="text-[11px] font-bold">{profile.city}</span>
              </div>
              <div className="pt-2">
                <span className="font-mono text-[10px] text-[#fed65b] font-bold">
                  NIA: {profile.nia}
                </span>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex flex-col items-center gap-1 mx-auto sm:mx-0">
              <div className="bg-white p-1.5 rounded-xl shadow-md border border-[#fed65b]/50">
                <img
                  alt="QR Code KartaNU"
                  className="w-16 h-16 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-ywECK3R6Bkbk7zjfmMNzI1KnJF0sh6ziL-U3Kw-nRRQDhg8XcD-A7TLtTOnc14Wsz0RmvPBG4MoLtShteLaxaKL66-odQUWpgcNKSjKjcZ0rrc9ZVlBOZ2vahrWWUEmUFaQzGM4wgxmde5UjAXHBBv-_LtnJGG007rXou8vnaei0jZlb-f8gR7EFO0XtMWUj2HqRL8DJQ8RDg3llpRY-Ax8i0A166KpMHJtwW-OF6SL_dnSqHKNRnTiwrfSJ2cBz1O58I2XSrneR"
                />
              </div>
              <span className="text-[9px] text-white/50 font-bold tracking-wider uppercase">Pindai Verifikasi</span>
            </div>
          </div>
        </div>

        {/* Buttons underneath member card */}
        <div className="flex gap-2">
          <button
            onClick={() => alert(`Unduhan Kartu Anggota ${profile.fullName} sedang dipersiapkan...`)}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-xs"
          >
            <Download size={16} /> Unduh Kartu
          </button>
          <button
            onClick={() => alert(`NIA Warga: ${profile.nia}\nSilakan salin kode untuk pendaftaran forum.`)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-emerald-850 py-3 rounded-xl font-bold text-xs"
          >
            <Share2 size={16} /> Bagikan NIA
          </button>
        </div>
      </section>

      {/* Success alert banner */}
      {successMsg && (
        <div className="p-3 bg-emerald-55 text-emerald-900 bg-emerald-50 rounded-xl border border-emerald-150 flex items-center gap-2 text-xs font-semibold animate-scale-up" id="dues-payment-success-msg">
          <CheckCircle size={16} className="text-emerald-800" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Details & Quick Action */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status card */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800">
              <Verified size={20} />
            </div>
            <h4 className="font-bold text-emerald-90 text-sm text-emerald-900">Status Keanggotaan</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs py-2 border-b border-gray-50">
              <span className="text-gray-400 font-semibold">Username Warga</span>
              <span className="font-extrabold text-emerald-900 bg-emerald-50/70 px-2.5 py-0.5 rounded font-mono select-all">
                @{profile.username || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs py-2 border-b border-gray-50">
              <span className="text-gray-400 font-semibold">Status KartaNU</span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold">
                {profile.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs py-2 border-b border-gray-50">
              <span className="text-gray-400 font-semibold">Mulai Bergabung</span>
              <span className="font-bold text-gray-800">{profile.joinedDate}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-2">
              <span className="text-gray-400 font-semibold">Jenis Warga</span>
              <span className="font-bold text-gray-800">{profile.memberType}</span>
            </div>
          </div>
        </div>

        {/* Quick actions card */}
        <div className="bg-gray-105 p-6 rounded-[24px] border border-gray-200/50 bg-gray-50/50 flex flex-col justify-between">
          <h4 className="font-bold text-[#00450d] text-sm mb-3">Aksi Cepat</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => alert(`Menampilkan logs riwayat aktivitas iuran wajib semenjak bergabung.`)}
              className="bg-white p-4 rounded-xl flex flex-col items-center gap-2 hover:shadow-sm transition-all border border-gray-100"
            >
              <History className="text-emerald-800" size={20} />
              <span className="text-[11px] font-semibold text-gray-600">Riwayat</span>
            </button>
            <button
              onClick={() => {
                setEditNameVal(profile.fullName);
                setEditUsernameVal(profile.username || "");
                setShowEditName(true);
              }}
              className="bg-white p-4 rounded-xl flex flex-col items-center gap-2 hover:shadow-sm transition-all border border-gray-100"
            >
              <Edit className="text-emerald-800" size={20} />
              <span className="text-[11px] font-semibold text-gray-600">Edit Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dues Ledger table */}
      <section className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-gray-100 bg-gray-50/40">
          <div>
            <h3 className="font-bold text-emerald-990 text-sm py-0.5 text-emerald-900">
              Riwayat Iuran Anggota
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold">Laporan kontribusi wajib bulanan warga Nahdliyin</p>
          </div>
          <span className="text-[10px] text-emerald-800 font-bold">Rp 10.000/Bulan</span>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-gray-400 font-bold uppercase tracking-wider">Bulan / Tahun</th>
                <th className="px-5 py-3 text-gray-400 font-bold uppercase tracking-wider">Jumlah</th>
                <th className="px-5 py-3 text-gray-400 font-bold uppercase tracking-wider">Metode</th>
                <th className="px-5 py-3 text-gray-400 font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profile.dues.map((due, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <p className="font-bold text-gray-800">{due.monthYear}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Ref: {due.ref}</p>
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-emerald-800">
                    Rp {due.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-500">{due.method}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-black rounded-full uppercase">
                      {due.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
          <button
            onClick={payNextDues}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full text-xs"
          >
            Bayar Iuran Sekarang
          </button>
        </div>
      </section>

      {/* Confirmation dues payment Modal */}
      {payingMonth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 space-y-4 shadow-2xl relative border border-emerald-50 animate-scale-up">
            
            {duesStatus === "idle" && (
              <>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-emerald-900 font-sans">Selesaikan Iuran Bulanan</h4>
                  <p className="text-[11px] text-gray-500 font-medium font-sans">Iuran wajib Rp 10.000/bulan diarahkan langsung ke pos keuangan Bank MWC NU.</p>
                </div>

                <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/50 space-y-0.5">
                  <p className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider">Periode Tagihan</p>
                  <p className="text-xs font-black text-gray-800 leading-tight">Iuran Wajib Anggota - {payingMonth}</p>
                  <p className="text-base font-black text-emerald-900 mt-1">Rp 10.000</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Jalur Alur Keuangan</p>
                  
                  <button
                    type="button"
                    onClick={() => setDuesMethod("bank_transfer")}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      duesMethod === "bank_transfer" ? "border-emerald-700 bg-emerald-50/20" : "border-gray-150"
                    }`}
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full border-4 border-white ring-2 ring-emerald-600 bg-emerald-700"></div>
                    <div>
                      <p className="text-xs font-black text-emerald-950">Transfer Bank MWCNU Pondok Aren (Prioritas)</p>
                      <p className="text-[10px] text-gray-450 text-gray-400">Kas Utama LAZISNU MWC Syariah di BSI</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDuesMethod("saldo")}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      duesMethod === "saldo" ? "border-emerald-700 bg-emerald-50/20" : "border-gray-150"
                    }`}
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-gray-300"></div>
                    <div>
                      <p className="text-xs font-black text-gray-800">Satu Saldo Koperasi Warga</p>
                      <p className="text-[10px] text-gray-400">Saldo saat ini: Rp {coopBalance.toLocaleString("id-ID")}</p>
                    </div>
                  </button>
                </div>

                {duesMethod === "bank_transfer" ? (
                  <div className="p-3 bg-[#fefdf0] border border-amber-200/50 rounded-xl space-y-1.5 text-xs">
                    <p className="text-[10px] uppercase font-black text-amber-800">Detail Rekening Bank MWC</p>
                    <div className="grid grid-cols-3 gap-y-0.5 font-semibold text-gray-750 text-gray-700">
                      <span className="text-gray-400">Penerima:</span>
                      <span className="col-span-2 text-emerald-950 font-black">BSI (Bank Syariah Indonesia)</span>
                      
                      <span className="text-gray-400">No. Rek:</span>
                      <span className="col-span-2 font-mono text-amber-950 font-extrabold bg-amber-50 px-1 rounded border border-amber-150">
                        451 - 1926-00-1175
                      </span>
                      
                      <span className="text-gray-400">A.N.:</span>
                      <span className="col-span-2 text-emerald-950 font-bold">LAZISNU-MWCNU PONDOK AREN</span>
                    </div>

                    <div className="pt-2 border-t border-amber-100 flex items-start gap-1.5 font-medium">
                      <input 
                        type="checkbox" 
                        id="dues_chk"
                        checked={duesConfirmChecked}
                        onChange={(e) => setDuesConfirmChecked(e.target.checked)}
                        className="mt-0.5 accent-emerald-800"
                      />
                      <label htmlFor="dues_chk" className="text-[9.5px] font-bold text-amber-955 text-amber-900 cursor-pointer select-none">
                        Saya mengkonfirmasi dana iuran dikirim ke rekening resmi di atas.
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 text-xs flex justify-between">
                    <span className="text-gray-400 font-semibold">Tersedia di Koperasi:</span>
                    <span className={coopBalance < 10000 ? "text-rose-600 font-extrabold" : "text-emerald-850 font-extrabold"}>
                      Rp {coopBalance.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setPayingMonth(null)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDuesPayment}
                    disabled={duesMethod === "bank_transfer" && !duesConfirmChecked}
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-45 disabled:cursor-not-allowed text-white rounded-full font-bold text-xs cursor-pointer text-center"
                  >
                    Bayar Sekarang
                  </button>
                </div>
              </>
            )}

            {duesStatus === "success" && (
              <div className="text-center p-1 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-md">
                  <CheckCircle size={36} className="text-emerald-800 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Iuran Terbayar Lunas
                  </span>
                  <h4 className="text-base font-black text-emerald-950 mt-1">Aliran Keuangan Sah & Terarah</h4>
                </div>

                {/* Receipt visual card */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-2 text-xs text-left relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-100/35 rounded-bl-[40px] flex items-center justify-center font-bold text-emerald-800/20 text-2xl select-none">
                    IUR
                  </div>
                  
                  <div className="space-y-1.5 text-gray-600 font-semibold">
                    <div className="flex justify-between">
                      <span>Kewajiban:</span>
                      <span className="font-bold text-emerald-950">Iuran Bulanan {payingMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Metode:</span>
                      <span className="font-bold text-emerald-950 uppercase">{duesMethod === "saldo" ? "Koperasi Digital" : "BSI Bank MWCNU"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-extrabold text-emerald-850 bg-emerald-100/50 px-2 rounded tracking-wide text-[10px]">LUNAS SEJAHTERA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>No Ref:</span>
                      <span className="font-mono text-[10px] text-gray-850">IUR-NUA-{Math.floor(Math.random()*89999 + 10000)}</span>
                    </div>
                    
                    <hr className="border-dashed border-gray-200 my-1" />
                    
                    <div className="flex justify-between mt-1 text-emerald-900 font-black">
                      <span>Nominal:</span>
                      <span>Rp 10.000</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPayingMonth(null);
                    setDuesStatus("idle");
                  }}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md"
                >
                  Selesai & Keluar
                </button>
              </div>
            )}

            {duesStatus === "failed" && (
              <div className="text-center p-1 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-md text-2xl font-black">
                  ✕
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Iuran Gagal
                  </span>
                  <h4 className="text-base font-black text-rose-950 mt-1">Kesalahan Kas / Limit Saldo</h4>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-left space-y-2">
                  <p className="text-xs font-bold text-rose-800">Pendebetan Gagal</p>
                  <p className="text-[11.5px] text-gray-600 leading-relaxed font-semibold">
                    {duesErrorMessage || "Maaf, sistem tidak dapat memproses pemotongan iuran bulanan dari Saldo Koperasi Warga."}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDuesStatus("idle");
                      setDuesMethod("bank_transfer");
                    }}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Pakai Bank VA
                  </button>
                  <button
                    onClick={() => {
                      setPayingMonth(null);
                      setDuesStatus("idle");
                    }}
                    className="flex-1 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Simple Edit Name Modal */}
      {showEditName && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-emerald-900">Edit Data Warga</h4>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Nama Lengkap Baru</label>
              <input
                required
                type="text"
                value={editNameVal}
                onChange={(e) => setEditNameVal(e.target.value)}
                placeholder="cth. Fauzi Ahmad"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Username Baru</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono font-medium">@</span>
                <input
                  required
                  type="text"
                  value={editUsernameVal}
                  onChange={(e) => setEditUsernameVal(e.target.value.toLowerCase().trim().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="cth. fauzi_ahmad"
                  className="w-full pl-7 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none text-sm font-medium font-mono"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowEditName(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (editNameVal.trim() && editUsernameVal.trim()) {
                    profile.fullName = editNameVal.trim();
                    profile.username = editUsernameVal.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
                    setShowEditName(false);
                    // trigger refresh
                    setSuccessMsg("Data warga berhasil diperbarui!");
                    setTimeout(() => setSuccessMsg(""), 3000);
                  }
                }}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-800/90 text-white rounded-full font-bold text-xs"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
