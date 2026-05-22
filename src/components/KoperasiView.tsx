import React, { useState, useEffect } from "react";
import { CoopProduct, UserProfile, LoanApplication } from "../types";
import { addNotification } from "../utils/notifications";
import { coopProducts } from "../mockData";
import { Wallet, Landmark, Handshake, History, ShoppingBag, MapPin, Contact2, CheckCircle2, ShieldClose, AlertCircle, Sparkles, HelpCircle, ArrowRight, User, Phone, CheckCircle, FileText, ChevronRight } from "lucide-react";

interface KoperasiViewProps {
  coopBalance: number;
  onPurchase: (amount: number, prodName: string) => void;
  onModifyBalance: (amount: number) => void;
  profile: UserProfile | null;
}

export default function KoperasiView({ coopBalance, onPurchase, onModifyBalance, profile }: KoperasiViewProps) {
  const [hideBalance, setHideBalance] = useState(false);
  const [activeProducts, setActiveProducts] = useState<CoopProduct[]>([]);
  
  // Dialog flow states
  const [selectedProduct, setSelectedProduct] = useState<CoopProduct | null>(null);
  const [prodQty, setProdQty] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nu_admin_coop") || localStorage.getItem("nu_coop_products_active");
    if (saved) {
      try {
        setActiveProducts(JSON.parse(saved));
      } catch (e) {
        setActiveProducts(coopProducts);
      }
    } else {
      setActiveProducts(coopProducts);
    }
  }, []);

  // Sharia Loan simulator
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanStep, setLoanStep] = useState<"syarat" | "form" | "success" | "failed">("syarat");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loanDisburseMethod, setLoanDisburseMethod] = useState<"coop" | "bank_mwc">("coop");

  // Detailed identity fields for sharia loan
  const [formName, setFormName] = useState("");
  const [formNia, setFormNia] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formJob, setFormJob] = useState("");
  const [formBusinessType, setFormBusinessType] = useState("");
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);

  // User's personal sharia loan applications list
  const [myLoans, setMyLoans] = useState<LoanApplication[]>([]);

  // Synchronize profile details when opened or changed
  useEffect(() => {
    if (profile) {
      setFormName(profile.fullName || "");
      setFormNia(profile.nia || "");
      setFormPhone(profile.emailOrPhone || "");
    }
  }, [profile, showLoanModal]);

  // Read personal loan applications from global Storage
  const loadMyLoans = () => {
    const list = localStorage.getItem("nu_sharia_loans");
    if (list) {
      try {
        const parsed = JSON.parse(list) as LoanApplication[];
        const personal = parsed.filter(ln => {
          return ln.nia === profile?.nia || ln.fullName === profile?.fullName;
        });
        setMyLoans(personal);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadMyLoans();
  }, [profile, showLoanModal]);

  // Self deposit simulator
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositStatus, setDepositStatus] = useState<"idle" | "success" | "failed">("idle");
  const [depositMethod, setDepositMethod] = useState<"bsi_mwc" | "tunai">("bsi_mwc");
  const [depositChecked, setDepositChecked] = useState(false);
  const [simulateFail, setSimulateFail] = useState(false);

  const handleCheckoutProduct = () => {
    if (!selectedProduct) return;
    const totalCost = selectedProduct.price * prodQty;
    
    if (coopBalance < totalCost) {
      alert("Maaf, saldo Koperasi Anda tidak mencukupi untuk melakukan pembelian ini.");
      return;
    }

    onPurchase(totalCost, `Pembelian ${prodQty}x ${selectedProduct.name}`);
    setPurchaseSuccess(true);
    
    // Trigger Success Notifications (Pengelola)
    const userName = profile?.fullName || "Warga Tamu";
    const prodName = selectedProduct.name;

    // Notification for manager
    addNotification({
      title: "Pesanan Produk Baru",
      message: `${userName} melakukan pembelian ${prodQty}x "${prodName}" seharga Rp ${totalCost.toLocaleString("id-ID")}.`,
      type: "produk",
      target: "pengelola",
      meta: { userName, amount: totalCost }
    });

    setTimeout(() => {
      setSelectedProduct(null);
      setPurchaseSuccess(false);
      setProdQty(1);
    }, 2000);
  };

  const handleRequestLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(loanAmount);
    if (isNaN(amount) || amount <= 0) {
      setLoanStep("failed");
      return;
    }
    
    // limit loan request to 10.000.000 max for simulation
    if (amount > 10000000) {
      setLoanStep("failed");
      return;
    }

    const newLoan: LoanApplication = {
      id: "LN-" + Math.floor(100000 + Math.random() * 900000).toString(),
      fullName: formName || profile?.fullName || "Warga",
      nia: formNia || profile?.nia || "PENDING VERIFIKASI",
      address: formAddress || "Tangerang Selatan",
      phone: formPhone || profile?.emailOrPhone || "-",
      job: formJob || "Wirausaha",
      businessType: formBusinessType || "Perdagangan UMKM",
      amount: amount,
      purpose: loanPurpose || "Modal usaha syariah",
      status: "Menunggu",
      submittedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) + " " + new Date().toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"}) + " WIB"
    };

    // Load and save globally
    const existing = localStorage.getItem("nu_sharia_loans");
    let allLoans: LoanApplication[] = [];
    if (existing) {
      try {
        allLoans = JSON.parse(existing);
      } catch (e) {}
    }
    allLoans.push(newLoan);
    localStorage.setItem("nu_sharia_loans", JSON.stringify(allLoans));

    // Reload active loans lists
    loadMyLoans();
    setLoanStep("success");

    // Trigger Notifications
    // Notification for managers (new request received)
    addNotification({
      title: "Pengajuan Pinjaman Baru",
      message: `${newLoan.fullName} mengajukan pinjaman syariah (Qardhul Hasan) sebesar Rp ${newLoan.amount.toLocaleString("id-ID")} untuk "${newLoan.purpose}".`,
      type: "koperasi",
      target: "pengelola",
      meta: { userName: newLoan.fullName, amount: newLoan.amount, referenceId: newLoan.id }
    });
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setDepositStatus("failed");
      return;
    }

    if (simulateFail) {
      setDepositStatus("failed");
      return;
    }
    
    onModifyBalance(amount);
    setDepositStatus("success");
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Cooperative Balance illuminated card */}
      <section className="relative overflow-hidden rounded-[28px] bg-emerald-800 p-6 text-white shadow-xl border border-emerald-500/20 group">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute top-1/2 -left-8 w-28 h-28 bg-emerald-300 opacity-10 rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-start mb-6 z-10 relative">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-emerald-200/80 uppercase">
              Saldo Keanggotaan Koperasi
            </p>
            <h2
              onClick={() => setHideBalance(!hideBalance)}
              className="text-3xl font-extrabold mt-1 text-[#fed65b] cursor-pointer hover:underline tracking-tight select-none"
            >
              {hideBalance ? "Rp ••••••••" : `Rp ${coopBalance.toLocaleString("id-ID")}`}
            </h2>
            <p className="text-[9px] text-emerald-250 font-bold mt-1 text-emerald-200">
              *Klik saldo untuk menyembunyikan/menampilkan
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setHideBalance(!hideBalance)}
            className="text-[#fed65b] hover:text-amber-300 transition-colors"
          >
            <Wallet size={36} className={`${hideBalance ? "opacity-50" : "opacity-100"}`} />
          </button>
        </div>

        {/* Balance partitions */}
        <div className="grid grid-cols-3 gap-2 pt-5 border-t border-white/10 text-xs z-10 relative">
          <div className="space-y-0.5">
            <p className="text-emerald-200/80 text-[10px] font-semibold">Simpanan Pokok</p>
            <p className="font-bold text-gray-100">Rp 500.000</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-emerald-200/80 text-[10px] font-semibold">Simpanan Wajib</p>
            <p className="font-bold text-gray-100">Rp 1.200.000</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-emerald-200/80 text-[10px] font-semibold">Sukarela</p>
            <p className="font-bold text-gray-100">
              {hideBalance ? "••••••" : `Rp ${(coopBalance - 1700000 > 0 ? coopBalance - 1700000 : 0).toLocaleString("id-ID")}`}
            </p>
          </div>
        </div>
      </section>

      {/* Main Core Layanan Koperasi Grid */}
      <section className="space-y-3">
        <h3 className="font-bold text-emerald-905 text-base text-emerald-900">Layanan Utama</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setShowDepositModal(true)}
            className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-gray-100 active:scale-95 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2 group-hover:bg-white transition-colors border border-emerald-100/10">
              <Landmark size={20} />
            </div>
            <span className="text-[11px] font-bold text-gray-600">Simpan Mandiri</span>
          </button>
          
          <button 
            onClick={() => setShowLoanModal(true)}
            className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-gray-100 active:scale-95 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:bg-white transition-colors border border-amber-105">
              <Handshake size={20} />
            </div>
            <span className="text-[11px] font-bold text-gray-600">Pinjaman Syariah</span>
          </button>

          <button 
            onClick={() => alert("Menampilkan log mutasi tabungan pokok, wajib, dan sukarela.")}
            className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-gray-100 active:scale-95 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-655 flex items-center justify-center mb-2 group-hover:bg-white transition-colors">
              <History size={20} className="text-gray-650 text-gray-600" />
            </div>
            <span className="text-[11px] font-bold text-gray-600">Riwayat Mutasi</span>
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-emerald-905 text-base text-emerald-900">Produk Warga (Pasar NU)</h3>
          <button className="text-xs font-bold text-amber-700 hover:underline">Lihat Semua</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 no-scrollbar snap-x">
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-44 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs snap-center flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gray-50 relative overflow-hidden">
                <img src={product.imgUrl} className="w-full h-full object-cover" alt={product.name} />
                {product.label && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-550 text-white font-extrabold text-[9px] rounded-full uppercase tracking-wider bg-amber-500">
                    {product.label}
                  </span>
                )}
              </div>
              <div className="p-3.5 space-y-2 flex flex-col justify-between border-t border-gray-50">
                <div>
                  <p className="font-bold text-gray-800 text-xs truncate leading-none mb-0.5">{product.name}</p>
                  <p className="font-bold text-emerald-800 text-[11px]">Rp {product.price.toLocaleString("id-ID")}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setProdQty(1);
                    setPurchaseSuccess(false);
                  }}
                  className="w-full py-1.5 bg-emerald-800 text-white hover:bg-emerald-900 rounded-lg text-[10px] font-bold"
                >
                  Beli
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sharia Loan Status Tracking list for the citizen */}
      {myLoans.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-bold text-base flex items-center gap-2 text-emerald-900">
            <Handshake size={18} className="text-emerald-800" />
            <span>Riwayat Pengajuan Qardhul Hasan Anda</span>
          </h3>
          <div className="space-y-2.5">
            {myLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[9px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md font-bold">{loan.id}</span>
                    <span className="text-gray-400 font-semibold">{loan.submittedAt}</span>
                  </div>
                  <h4 className="font-extrabold text-[#00450d] text-sm mt-1">Rp {loan.amount.toLocaleString("id-ID")}</h4>
                  <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                    Rencana/Tujuan: <span className="text-gray-700">{loan.purpose}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">Pekerjaan: {loan.job} • {loan.businessType}</p>
                </div>
                <div className="flex flex-col justify-between items-end shrink-0 sm:text-right">
                  <div>
                    {loan.status === "Menunggu" && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/50 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                        ● Menunggu Persetujuan
                      </span>
                    )}
                    {loan.status === "Disetujui" && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                        ✓ Disetujui (Dicairkan)
                      </span>
                    )}
                    {loan.status === "Ditolak" && (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                        ✕ Ditolak Pengurus
                      </span>
                    )}
                  </div>
                  {loan.status === "Menunggu" && (
                    <p className="text-[9px] text-amber-800 bg-amber-50/40 p-1 rounded-lg border border-amber-100/40 mt-1.5 font-medium">Sedang diproses oleh pengurus</p>
                  )}
                  {loan.status === "Disetujui" && (
                    <p className="text-[9px] text-emerald-800 font-bold mt-1.5 bg-emerald-50/50 px-1.5 py-0.5 rounded border border-emerald-100/40">Dana ditransfer ke rekening / saldo</p>
                  )}
                  {loan.status === "Ditolak" && (
                    <p className="text-[9px] text-rose-600 font-semibold mt-1.5 italic">Gagal validasi data diri pengurus</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Office & Customer Care coordinates */}
      <section className="bg-gray-50 rounded-3xl p-5 border border-gray-200/50 space-y-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800">
            <MapPin size={20} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-990 leading-none">Kantor Sekretariat</h4>
            <p className="text-gray-400 font-semibold mt-1">Jl. Raya Pondok Aren No. 45, Tangerang Selatan</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-11 h-11 shrink-0 rounded-full bg-amber-50 flex items-center justify-center text-yellow-800">
            <Contact2 size={20} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-990 leading-none">Layanan Anggota</h4>
            <p className="text-gray-400 font-semibold mt-1">WhatsApp: +62 812 3456 7890</p>
          </div>
        </div>
      </section>

      {/* Self-Deposit Deposit simulator Dialog */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 space-y-4 shadow-2xl relative border border-emerald-50 animate-scale-up">
            
            {depositStatus === "idle" && (
              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-base font-black text-emerald-900">Simpan Mandiri (Setor Tabungan)</h4>
                  <p className="text-[11px] text-gray-500 font-semibold">Kreditkan dana amanah langsung ke saldo Koperasi Syariah Anda.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Jumlah Setoran (Rp)</label>
                    <input
                      required
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="cth. 250000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none text-sm font-bold text-emerald-950"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Saluran Transfer Bank</label>
                    <button
                      type="button"
                      onClick={() => setDepositMethod("bsi_mwc")}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        depositMethod === "bsi_mwc" ? "border-emerald-700 bg-emerald-50/25" : "border-gray-150"
                      }`}
                    >
                      <div className="mt-0.5 w-4 h-4 rounded-full border-4 border-white ring-2 ring-emerald-600 bg-emerald-700"></div>
                      <div>
                        <p className="text-xs font-black text-emerald-950">Transfer Virtual Account Bank MWC</p>
                        <p className="text-[10px] text-gray-400">Instan & terintegrasi langsung dengan pos keuangan</p>
                      </div>
                    </button>
                  </div>

                  {depositMethod === "bsi_mwc" && (
                    <div className="p-3 bg-yellow-50/50 rounded-xl border border-amber-200/50 space-y-1.5 text-xs text-amber-900">
                      <p className="text-[10px] font-black uppercase">Instruksi Transfer BSI</p>
                      <div className="grid grid-cols-3 gap-y-0.5 font-semibold text-gray-700">
                        <span className="text-gray-400">Bank Target:</span>
                        <span className="col-span-2 text-emerald-950 font-black">BSI (Bank Syariah Indonesia)</span>
                        <span className="text-gray-400">No. Rek:</span>
                        <span className="col-span-2 font-mono text-emerald-900 font-extrabold">451 - 1926-088-7512</span>
                        <span className="text-gray-400">Atas Nama:</span>
                        <span className="col-span-2 text-emerald-950 font-bold">KOP-SYARIAH MWC NU PONDOK AREN</span>
                      </div>
                      <div className="pt-2 border-t border-amber-200/50 flex items-center gap-1.5 font-medium">
                        <input
                          type="checkbox"
                          id="dep_chk"
                          checked={depositChecked}
                          onChange={(e) => setDepositChecked(e.target.checked)}
                          className="accent-amber-600"
                        />
                        <label htmlFor="dep_chk" className="text-[10px] cursor-pointer">Saya sudah mensimulasikan transfer luar negeri/lokal</label>
                      </div>
                    </div>
                  )}

                  {/* Simulator failure path trigger representation for checking failed popup */}
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500">Simulasikan Response Gagal?</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={simulateFail} 
                        onChange={(e) => setSimulateFail(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:width-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDepositModal(false);
                      setDepositStatus("idle");
                    }}
                    className="flex-1 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-xs cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={depositMethod === "bsi_mwc" && !depositChecked}
                    className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-center"
                  >
                    Setor Sekarang
                  </button>
                </div>
              </form>
            )}

            {depositStatus === "success" && (
              <div className="text-center p-2 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-md">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Penyetoran Berhasil
                  </span>
                  <h4 className="text-base font-black text-emerald-950 mt-1">Saldo Koperasi Ditambahkan</h4>
                </div>

                {/* Receipt visual card */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-2 text-xs text-left relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-100/35 rounded-bl-[40px] flex items-center justify-center font-bold text-emerald-800/20 text-2xl select-none">
                    KOP
                  </div>
                  
                  <div className="space-y-1.5 text-gray-600 font-semibold">
                    <div className="flex justify-between">
                      <span>Metode:</span>
                      <span className="font-bold text-emerald-950 uppercase">Transfer BSI MWCNU</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waktu:</span>
                      <span className="font-mono text-[10px] text-gray-800">Hari ini, {new Date().toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"})} WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>No Referensi:</span>
                      <span className="font-mono text-[10px] text-gray-800 font-bold uppercase">KSA-DEP-{Math.floor(Math.random()*899999 + 100000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Penerima:</span>
                      <span className="font-extrabold text-emerald-900 text-[10px]">Bank MWC Pondok Aren QB-4</span>
                    </div>
                    
                    <hr className="border-dashed border-gray-200 my-1" />
                    
                    <div className="flex justify-between mt-1 text-emerald-900 font-black">
                      <span>Saldo Bertambah:</span>
                      <span>Rp {parseFloat(depositAmount).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositStatus("idle");
                    setDepositAmount("");
                    setDepositChecked(false);
                  }}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md"
                >
                  Selesai & Keluar
                </button>
              </div>
            )}

            {depositStatus === "failed" && (
              <div className="text-center p-2 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-md">
                  <span className="text-2xl font-black">✕</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Penyetoran Gagal
                  </span>
                  <h4 className="text-base font-black text-rose-950 mt-1">Gagal Sinkronisasi Setoran</h4>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-left space-y-2">
                  <p className="text-xs font-bold text-rose-800">Bank MWC Pondok Aren</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                    {simulateFail 
                      ? "Penyetoran dibatalkan secara manual melalui skenario simulasi kegagalan sistem pengurus."
                      : "Gagal me-verifikasi setoran. Pastikan nominal transfer cocok dan tidak kurang dari Rp 10.000."
                    }
                  </p>
                </div>

                <button
                  onClick={() => {
                    setDepositStatus("idle");
                    setSimulateFail(false);
                  }}
                  className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                >
                  Coba Lagi
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Benevolent Sharia Loan simulator Dialog */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 space-y-4 shadow-2xl relative border border-emerald-50 animate-scale-up max-h-[92vh] overflow-y-auto no-scrollbar">
            
            {loanStep === "syarat" && (
              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Tahap 1 dari 2: Ketentuan & Validasi
                  </span>
                  <h4 className="text-base font-black text-emerald-900 mt-1">Syarat & Akad Pinjaman Syariah pertama</h4>
                  <p className="text-[10.5px] text-gray-500 font-medium">Program pembiayaan kebajikan (Qardhul Hasan) terpadu dengan dana umat.</p>
                </div>

                <div className="bg-[#fefdf0] border border-amber-200/60 rounded-2xl p-4 space-y-3">
                  <p className="text-[10px] uppercase font-black text-amber-800 tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> Persyaratan Pengajuan Pertama:
                  </p>
                  
                  <ul className="space-y-2.5 text-[11px] text-gray-700 font-semibold list-none pl-0">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#00450d] font-bold">1.</span>
                      <span>Melakukan pengisian <strong>Data Diri Lengkap</strong> & informasi profil usaha yang sah.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#00450d] font-bold">2.</span>
                      <span>Batas maksimal pinjaman pertama adalah senilai <strong>Rp 10.000.000</strong>.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#00450d] font-bold">3.</span>
                      <span>Sistem <strong>Akad Qardhul Hasan</strong> (Murni Syariah Tanpa Bunga & Tanpa Riba 0%).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#00450d] font-bold">4.</span>
                      <span>Diawasi & <strong>disetujui secara manual</strong> oleh Admin Pengelola Bank MWC NU Pondok Aren.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-start gap-2.5 font-bold">
                  <input
                    type="checkbox"
                    id="chk_terms"
                    checked={isCheckedTerms}
                    onChange={(e) => setIsCheckedTerms(e.target.checked)}
                    className="mt-0.5 accent-emerald-800 cursor-pointer"
                  />
                  <label htmlFor="chk_terms" className="text-[10.5px] text-gray-700 cursor-pointer select-none leading-relaxed">
                    Saya menyatakan adalah warga Nahdliyin, menyetujui akad ini, dan berkomitmen melunasi angsuran secara amanah demi keadilan sirkulasi modal daerah.
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoanModal(false);
                      setLoanStep("syarat");
                    }}
                    className="flex-1 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={!isCheckedTerms}
                    onClick={() => setLoanStep("form")}
                    className="flex-1 py-3 bg-emerald-850 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-800 text-white rounded-xl font-bold text-xs cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <span>Isi Formulir</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {loanStep === "form" && (
              <form onSubmit={handleRequestLoan} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Tahap 2 dari 2: Identitas & Nominal
                  </span>
                  <h4 className="text-base font-black text-emerald-990 font-sans text-emerald-950">Formulir Pengajuan Dana</h4>
                  <p className="text-[10.5px] text-gray-500 font-medium">Lengkapi identitas asli Anda untuk diintegrasikan ke pengelola.</p>
                </div>

                <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
                  <div className="space-y-0.5">
                    <label className="text-[10px] uppercase font-extrabold text-gray-400">Nama Lengkap Pemohon</label>
                    <input
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="cth. H. Wawan Setiawan"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none font-bold text-gray-800"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10px] uppercase font-extrabold text-gray-400">Nomor Induk Anggota (NIA)</label>
                    <input
                      required
                      type="text"
                      value={formNia}
                      onChange={(e) => setFormNia(e.target.value)}
                      placeholder="cth. 31.74.02.2023.00192"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none font-bold text-gray-800"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10px] uppercase font-extrabold text-gray-400">No. HP / WhatsApp (Aktif)</label>
                    <input
                      required
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="cth. 0812XXXXXXXX"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none font-semibold text-gray-800"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10px] uppercase font-extrabold text-gray-400">Alamat Rumah Lengkap</label>
                    <input
                      required
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="cth. Gg. Masjid Baiturrahman No. 12, Pondok Aren"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none font-semibold text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="text-[9px] uppercase font-extrabold text-gray-400">Pekerjaan Utama</label>
                      <input
                        required
                        type="text"
                        value={formJob}
                        onChange={(e) => setFormJob(e.target.value)}
                        placeholder="cth. Pedagang Sembako"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none font-semibold text-gray-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] uppercase font-extrabold text-gray-400">Kategori Usaha</label>
                      <input
                        required
                        type="text"
                        value={formBusinessType}
                        onChange={(e) => setFormBusinessType(e.target.value)}
                        placeholder="cth. Kios Kelontong"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none font-semibold text-gray-800"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-100 my-2" />

                  <div className="space-y-0.5">
                    <label className="text-[10px] uppercase font-extrabold text-gray-400">Jumlah Pinjaman (Maksimal Rp 10jt)</label>
                    <input
                      required
                      type="number"
                      max={10000000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="cth. 5000000"
                      className="w-full px-4 py-2.5 bg-gray-550 bg-gray-50 border border-emerald-100 rounded-xl focus:border-emerald-800 focus:bg-white outline-none font-black text-amber-950 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10px] uppercase font-extrabold text-gray-400">Rencana Penggunaan & Pengembalian</label>
                    <textarea
                      required
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      placeholder="Tuliskan tujuan modal usaha atau keperluan mendesak, serta cara mengangsur qardhul hasan..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white outline-none font-semibold text-gray-800 h-16 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoanStep("syarat")}
                    className="flex-1 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md"
                  >
                    Ajukan Sekarang
                  </button>
                </div>
              </form>
            )}

            {loanStep === "success" && (
              <div className="text-center p-2 space-y-4 animate-scale-up text-xs font-sans">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-md">
                  <CheckCircle size={36} className="text-emerald-800 animate-bounce" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-amber-500 text-amber-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Terintegrasi ke Pengelola
                  </span>
                  <h4 className="text-base font-black text-emerald-990 mt-1 text-emerald-900">Pengajuan Berhasil Dikirim!</h4>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-left space-y-2">
                  <p className="text-xs font-black text-emerald-950 flex items-center gap-1">
                    <FileText size={13} className="text-emerald-800" />
                    <span>Akun Terhubung: Admin PWNU</span>
                  </p>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                    Pembiayaan Qardhul Hasan Anda sebesar <span className="font-extrabold text-emerald-900">Rp {Number(loanAmount).toLocaleString("id-ID")}</span> telah diteruskan ke dasbor kerja Admin Pengelola untuk diverifikasi secara manual.
                  </p>
                  <p className="text-[11.5px] text-amber-800 font-bold bg-amber-50/50 p-2 rounded border border-amber-100">
                    💡 Anda dapat menilik status persetujuan langsung pada panel di bagian bawah halaman Koperasi ini.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowLoanModal(false);
                    setLoanStep("syarat");
                    setLoanAmount("");
                    setLoanPurpose("");
                    setFormAddress("");
                    setFormJob("");
                    setFormBusinessType("");
                    setIsCheckedTerms(false);
                  }}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md"
                >
                  Selesai & Keluar
                </button>
              </div>
            )}

            {loanStep === "failed" && (
              <div className="text-center p-2 space-y-4 animate-scale-up text-xs">
                <div className="w-16 h-16 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-md">
                  <span className="text-2xl font-black">✕</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Kesalahan Nominal
                  </span>
                  <h4 className="text-base font-black text-rose-950 mt-1">Batas Maksimum Terlampaui</h4>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-left space-y-2">
                  <p className="text-xs font-bold text-rose-800">Qardhul Hasan Syariah</p>
                  <p className="text-[11px] text-gray-600 leading-normal font-semibold">
                    Maaf, batas maksimum pinjaman kebajikan produktif pertama tanpa bunga (Qardhul Hasan) adalah sebesar <span className="font-extrabold text-rose-950">Rp 10.000.000</span>.
                    Pengisian nominal Rp {parseFloat(loanAmount || "0").toLocaleString("id-ID")} tidak dapat dikirim demi keadilan alokasi sirkulasi kas umat.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLoanStep("form");
                      setLoanAmount("10000000"); // auto fallback
                    }}
                    className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-150 text-emerald-800 rounded-xl font-bold text-xs"
                  >
                    Perbaiki Limit
                  </button>
                  <button
                    onClick={() => {
                      setShowLoanModal(false);
                      setLoanStep("syarat");
                      setLoanAmount("");
                    }}
                    className="flex-1 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs shadow-sm"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Buy Product dialog */}  {/* Buy Product dialog */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-emerald-900">Beli Produk Warga</h4>
            
            {purchaseSuccess ? (
              <div className="text-center p-4 space-y-2 flex flex-col items-center">
                <CheckCircle2 size={48} className="text-emerald-800 animate-bounce" />
                <p className="font-bold text-emerald-900 mt-2">Pembelian Berhasil!</p>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Terima kasih, pembayaran sebesar Rp {(selectedProduct.price * prodQty).toLocaleString("id-ID")} berhasil terpotong dari saldo koperasi Anda. Kurir Koperasi akan mengantarkannya ke wilayah PCNU Anda.
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <img src={selectedProduct.imgUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-gray-800">{selectedProduct.name}</h5>
                    <p className="text-emerald-800 font-bold text-xs mt-1">Rp {selectedProduct.price.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 font-medium leading-relaxed">
                  {selectedProduct.description}
                </div>

                {/* Qty field */}
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500">Jumlah Unit</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProdQty(Math.max(1, prodQty - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-xs font-bold hover:bg-gray-100 active:scale-90"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{prodQty}</span>
                    <button
                      onClick={() => setProdQty(prodQty + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-xs font-bold hover:bg-gray-100 active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 text-xs border-t border-gray-100">
                  <span className="font-semibold text-gray-400">Total Pembayaran:</span>
                  <span className="font-extrabold text-sm text-emerald-800">
                    Rp {(selectedProduct.price * prodQty).toLocaleString("id-ID")}
                  </span>
                </div>

                {coopBalance < (selectedProduct.price * prodQty) ? (
                  <p className="text-[10px] text-rose-500 font-bold leading-normal">
                    *Saldo Koperasi tidak mencukupi untuk melakukan checkout total pembayaran.
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-400 leading-normal">
                    Dana akan langsung dipotong dari saldo Keanggotaan koperasi digital Anda secara instan.
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 py-2.5 border border-gray-100 text-gray-500 hover:bg-gray-50 rounded-full font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    disabled={coopBalance < (selectedProduct.price * prodQty)}
                    onClick={handleCheckoutProduct}
                    className="flex-1 py-2.5 bg-emerald-800 disabled:opacity-50 hover:bg-emerald-900 text-white rounded-full font-bold text-xs"
                  >
                    Bayar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
