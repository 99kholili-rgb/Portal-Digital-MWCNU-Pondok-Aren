import React, { useState } from "react";
import { Sparkles, Briefcase, Award, Sprout, Heart, CheckCircle2, DollarSign, Users } from "lucide-react";
import { UserProfile } from "../types";
import { addNotification } from "../utils/notifications";

interface DonasiViewProps {
  onAddTransaction: (amount: number, program: string) => void;
  coopBalance: number;
  profile: UserProfile | null;
}

export default function DonasiView({ onAddTransaction, coopBalance, profile }: DonasiViewProps) {
  const [calcTab, setCalcTab] = useState<"penghasilan" | "emas" | "fitrah">("penghasilan");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [goldAmount, setGoldAmount] = useState("");
  const [fitrahPeople, setFitrahPeople] = useState("1");
  const [calculatedZakat, setCalculatedZakat] = useState<number | null>(null);
  
  // Checkout model states
  const [checkoutProgram, setCheckoutProgram] = useState<string | null>(null);
  const [checkoutAmount, setCheckoutAmount] = useState<number>(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");
  const [paymentMethod, setPaymentMethod] = useState<"saldo" | "bank_transfer">("saldo");
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const calculateZakat = () => {
    if (calcTab === "penghasilan") {
      const income = parseFloat(incomeAmount) || 0;
      if (income >= 7400000) {
        setCalculatedZakat(income * 0.025);
      } else {
        setCalculatedZakat(0); // below nisab
      }
    } else if (calcTab === "emas") {
      const gold = parseFloat(goldAmount) || 0;
      if (gold >= 85) {
        const goldVal = gold * 1050000;
        setCalculatedZakat(goldVal * 0.025);
      } else {
        setCalculatedZakat(0); // below nisab
      }
    } else {
      const people = parseInt(fitrahPeople) || 1;
      setCalculatedZakat(people * 45000);
    }
  };

  const handleOpenCheckout = (program: string, initialAmount: number) => {
    setCheckoutProgram(program);
    setCheckoutAmount(initialAmount);
    setPaymentStatus("idle");
    setPaymentMethod("bank_transfer"); // Default to bank transfer to Bank MWCNU Pondok Aren
    setTransferConfirmed(false);
    setErrorMessage("");
    setShowCheckoutModal(true);
  };

  const handlePayZakat = () => {
    if (checkoutAmount <= 0) {
      setErrorMessage("Nominal pembayaran zakat harus lebih dari Rp 0.");
      setPaymentStatus("failed");
      return;
    }

    if (paymentMethod === "saldo") {
      if (coopBalance < checkoutAmount) {
        setErrorMessage("Saldo Koperasi Anda tidak mencukupi untuk melakukan transaksi ini.");
        setPaymentStatus("failed");
        return;
      }
      // Deduct balance
      onAddTransaction(checkoutAmount, checkoutProgram || "Iuran Zakat");
      setPaymentStatus("success");
    } else {
      // Bank Transfer simulated path
      onAddTransaction(checkoutAmount, `${checkoutProgram || "Donasi"} (via Bank MWCNU Pondok Aren)`);
      setPaymentStatus("success");
    }

    // Trigger Success Notifications (Pengelola)
    const progLabel = checkoutProgram || "Zakat & Sedekah";
    const donorName = profile?.fullName || "Warga Tamu";

    // Notification for managers
    addNotification({
      title: "Pembayaran Zakat Baru",
      message: `${donorName} telah membayar zakat sebesar Rp ${checkoutAmount.toLocaleString("id-ID")} untuk program "${progLabel}".`,
      type: "zakat",
      target: "pengelola",
      meta: { userName: donorName, amount: checkoutAmount }
    });
  };

  const handleCloseCheckout = () => {
    setShowCheckoutModal(false);
    setPaymentStatus("idle");
    setCalculatedZakat(null);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Top Banner stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-6 rounded-3xl bg-emerald-800 text-white shadow-md relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 space-y-4">
            <div>
              <p className="text-xs font-mono tracking-widest text-emerald-200/80 uppercase">
                Ringkasan Donasi Saya
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-[#fed65b]">
                Rp 842.500
              </h2>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-2.5">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-850 bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaS-Snh8pnTr7VQ3yEASKOvDcFUC7wL1x4tfEoZj3yDBdpUUEzhEicKr5jmVe_i0epcvCiyB_bZuaHfp9qlCJxBLUCaGYdfz-We5UDn6NjmrM1X46COQWFTEL58pXAhmWBjrSoVxs_ndfGdvauvht9FQPgFgiBghczdWPVSmPUtGAC5P-Q0jN2hMx1YkK80SzBHWs4mUVy1hVPPM8Lg5AMbebA5FL-Q_IiJZEsrYe0v642F0s2srWRIzk_1qFiJnOUnY3Xluj7LvPL" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-850 bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD26YtBbrU5UCXAVAsxtExpWn3CPu728-LHXEjOyR2pU913g4MkAz6dsndh3L0h712JFYYBoPrx8precXCHCr0oF6xip_HlXmfbxKlHdUZMpnWffydttVMxoV_Wu-ahh_2nUiXaVNADkNqQT6yCwIIhEBZZ_RQ6zev1yc4ur_3EFt9kU3imAit26LlTyWN1U1zOaWb_1LzfMGskq8iNjXdd-ZBqzQ2eyBGlcfO4sV6P0sSSOimbR2FtlS5tTZ0gKF930yypITRvX7qG" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-850 bg-emerald-900 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                  +12
                </div>
              </div>
              <span className="text-xs text-emerald-105 font-medium text-emerald-100/90">
                Berkontribusi di 3 program aktif
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-gray-50 flex flex-col justify-between border border-gray-200/60 shadow-sm">
          <div>
            <Sparkles className="text-amber-600 mb-2" size={24} />
            <p className="font-bold text-emerald-900 text-lg">Cek Nisab</p>
            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Update: 21 Mei 2026</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-500">Kadar Emas</span>
              <span className="font-bold text-gray-800">85 Gram</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-500">Nilai Rupiah</span>
              <span className="font-bold text-emerald-800">Rp 89.250.000</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-emerald-990 text-lg text-emerald-900">Kalkulator Zakat</h3>
        
        {/* Tab buttons */}
        <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
          <button
            onClick={() => { setCalcTab("penghasilan"); setCalculatedZakat(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              calcTab === "penghasilan" ? "bg-white text-emerald-850 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Briefcase size={16} />
            <span>Penghasilan</span>
          </button>
          <button
            onClick={() => { setCalcTab("emas"); setCalculatedZakat(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              calcTab === "emas" ? "bg-white text-emerald-850 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Award size={16} />
            <span>Emas/Perak</span>
          </button>
          <button
            onClick={() => { setCalcTab("fitrah"); setCalculatedZakat(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              calcTab === "fitrah" ? "bg-white text-emerald-850 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Sprout size={16} />
            <span>Fitrah</span>
          </button>
        </div>

        {/* Input Fields depending on active tab */}
        <div className="space-y-4 pt-2">
          {calcTab === "penghasilan" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Pendapatan Bulanan (Rp)
              </label>
              <input
                type="number"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                placeholder="cth. 8000000"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white focus:ring-0 outline-none transition-all text-sm"
              />
              <p className="text-[10px] text-gray-400 font-medium">Standard nishab adalah pendapatan ≥ Rp 7,4 Juta (setara nilai perak/emas per bulan)</p>
            </div>
          )}

          {calcTab === "emas" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Berat Emas yang Disimpan (Gram)
              </label>
              <input
                type="number"
                value={goldAmount}
                onChange={(e) => setGoldAmount(e.target.value)}
                placeholder="cth. 90"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white focus:ring-0 outline-none transition-all text-sm"
              />
              <p className="text-[10px] text-gray-400 font-medium">Nishab minimal kepemilikan emas adalah 85 Gram yang disimpan selama 1 haul penuh</p>
            </div>
          )}

          {calcTab === "fitrah" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Jumlah Anggota Keluarga (Jiwa)
              </label>
              <input
                type="number"
                value={fitrahPeople}
                onChange={(e) => setFitrahPeople(e.target.value)}
                placeholder="cth. 4"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-800 focus:bg-white focus:ring-0 outline-none transition-all text-sm"
              />
              <p className="text-[10px] text-gray-400 font-medium">Dihitung sebesar 3.5 liter karbohidrat pokok atau senilai uang Rp 45.000 per jiwa</p>
            </div>
          )}

          {/* Calculate button */}
          <button
            onClick={calculateZakat}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            Hitung Zakat
          </button>

          {/* Display calculation result */}
          {calculatedZakat !== null && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col items-center text-center animate-fade-in">
              <span className="text-xs text-emerald-850 font-bold uppercase tracking-wider">Kewajiban Zakat Anda</span>
              <span className="text-2xl font-extrabold text-emerald-900 mt-1">
                Rp {calculatedZakat.toLocaleString("id-ID")}
              </span>
              {calculatedZakat > 0 ? (
                <>
                  <p className="text-[11px] text-gray-500 mt-2 max-w-xs">
                    Kewajiban zakat Anda telah mencapai nishab atau merupakan taksiran fitrah keluarga. Tunaikan untuk membersihkan rezeki.
                  </p>
                  <button
                    onClick={() => handleOpenCheckout(
                      calcTab === "fitrah" ? "Zakat Fitrah" : "Zakat Maal", 
                      calculatedZakat
                    )}
                    className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-xs"
                  >
                    Tunaikan Zakat Ini
                  </button>
                </>
              ) : (
                <p className="text-xs text-emerald-700/80 mt-2 font-medium">
                  Alhamdulillah, besaran aset berada di bawah batas kewajiban nishab. Anda tidak berkewajiban membayar zakat saat ini, namun sangat disarankan untuk bersedekah sukarela.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Programs */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-emerald-990 text-lg text-emerald-900">Program Unggulan</h3>
          <button className="text-xs font-bold text-amber-700 hover:underline">Lihat Semua</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden relative bg-slate-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcA2K1-pcxKpVxRA1mhPvMnGNGFqUGBsjzow0Kaq21Qwkk4qs7l5sooTV4BA_9KwhJ-W2Nj9gr2ykjatEfYsIEJ6b0GVpWuUgP34JMNGfLr2bC768QIOR7JZIEcEY76zzoV8D-pGoi_5myA21AKEuqhC4Aa1qWtdmjhrsrXh9BR54XqmIvbTIpmza3_zGMGkRs9oRZz6eBdropuQAp2_FaaE-ePOkePkwBi5bFebS39duugava7PAgXJIG4FPhuTATAI5esJ_3BwcK"
                alt="Donasi Pendidikan"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 right-4 bg-emerald-900/90 text-white px-3 py-1 font-bold text-[10px] rounded-full uppercase tracking-wider backdrop-blur-sm">
                Kemanusiaan
              </span>
            </div>
            <div className="p-5 space-y-4">
              <h4 className="font-bold text-emerald-990 text-base leading-snug">
                Zakat untuk Pendidikan Anak Yatim
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Terkumpul 75%</span>
                  <span className="text-emerald-800">Rp 45.000.000</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-800 h-full w-[75%] rounded-full"></div>
                </div>
              </div>
              <button 
                onClick={() => handleOpenCheckout("Zakat Pendidikan Anak Yatim", 100000)}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-bold text-xs"
              >
                Tunaikan Zakat
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden relative bg-slate-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD37RUj2crS_oBhS5uGdk3Ge6kzHKycJ633_86Ln71sjFBwNEWMcZW4x-NVpxniF_0-sRm7F5S7CslluJqmVQ6pl7lohWGKQq4yNA94yLWCbEjgFmJiFzdu_2-GCA8QEKzJiJnNcHr979Bf9hk0PHxrOxdLr03K1QtOxj55z9uUOea2r-ntWNsoPmvnwNo6_N6F6jsMbbCDjWUSLbGT_pF-zqQlWbTrr2MxKzX8SAkk-ZH7d_a6n1zD80GsF5NlOIm5n--kF8xdU-rJ"
                alt="Renovasi Masjid"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 right-4 bg-emerald-900/90 text-white px-3 py-1 font-bold text-[10px] rounded-full uppercase tracking-wider backdrop-blur-sm">
                Masjid
              </span>
            </div>
            <div className="p-5 space-y-4">
              <h4 className="font-bold text-emerald-990 text-base leading-snug">
                Renovasi Masjid di Daerah 3T
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Terkumpul 30%</span>
                  <span className="text-emerald-800">Rp 120.000.000</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-800 h-full w-[30%] rounded-full"></div>
                </div>
              </div>
              <button 
                onClick={() => handleOpenCheckout("Renovasi Masjid Daerah 3T", 250000)}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-bold text-xs"
              >
                Tunaikan Zakat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 space-y-4 border border-gray-100 shadow-2xl relative animate-scale-up">
            
            {paymentStatus === "idle" && (
              <>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-emerald-900">Salurkan Donasi Melalui Bank</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Dana donasi disalurkan langsung secara terarah untuk kemaslahatan umat.</p>
                </div>
                
                {/* Program Details */}
                <div className="bg-emerald-50/55 p-3.5 rounded-2xl border border-emerald-100/50 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Program Penerima</p>
                  <p className="text-xs font-black text-gray-800 leading-tight">{checkoutProgram}</p>
                  <p className="text-base font-black text-[#00450d] mt-1">
                    Rp {checkoutAmount.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Bank Route Selection */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Pilih Jalur Alur Keuangan</p>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "bank_transfer" 
                        ? "border-emerald-700 bg-emerald-50/20" 
                        : "border-gray-150 hover:bg-gray-50"
                    }`}
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full border-4 border-white ring-2 ring-emerald-600 bg-emerald-700"></div>
                    <div>
                      <p className="text-xs font-black text-emerald-950">Transfer Bank MWCNU Pondok Aren (Utama)</p>
                      <p className="text-[10px] text-gray-500 font-medium">Langsung ke pembukuan LAZISNU Syariah di BSI</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("saldo")}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "saldo" 
                        ? "border-emerald-700 bg-emerald-50/20" 
                        : "border-gray-150 hover:bg-gray-50"
                    }`}
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-gray-300"></div>
                    <div>
                      <p className="text-xs font-black text-gray-800">Potong Saldo Koperasi Warga</p>
                      <p className="text-[10px] text-gray-500 font-medium">Saldo digital koperasi Anda: Rp {coopBalance.toLocaleString("id-ID")}</p>
                    </div>
                  </button>
                </div>

                {/* Route detail display */}
                {paymentMethod === "bank_transfer" ? (
                  <div className="p-3.5 bg-[#fefdf0] border border-amber-200/60 rounded-xl space-y-2 text-xs">
                    <p className="text-[10px] uppercase font-black text-amber-800">Detail Rekening Bank MWCNU</p>
                    <div className="grid grid-cols-3 gap-y-1 font-semibold text-gray-700">
                      <span className="text-gray-400 font-bold">Transfer Ke:</span>
                      <span className="col-span-2 text-emerald-950 font-black">Bank Syariah Indonesia (BSI)</span>
                      
                      <span className="text-gray-400 font-bold">No. Rek:</span>
                      <span className="col-span-2 text-amber-950 font-black font-mono bg-amber-50 px-1 py-0.5 rounded border border-amber-150 text-xs w-fit">
                        451 - 1926-00-1175
                      </span>
                      
                      <span className="text-gray-400 font-bold">Atas Nama:</span>
                      <span className="col-span-2 text-emerald-950 font-black">LAZISNU-MWCNU PONDOK AREN</span>
                    </div>
                    <div className="pt-2 border-t border-amber-100/50 flex items-start gap-1.5">
                      <input 
                        type="checkbox" 
                        id="chk_confirm"
                        checked={transferConfirmed}
                        onChange={(e) => setTransferConfirmed(e.target.checked)}
                        className="mt-0.5 accent-emerald-800"
                      />
                      <label htmlFor="chk_confirm" className="text-[9px] font-bold text-amber-900 cursor-pointer select-none">
                        Saya sudah mensimulasikan / mengirim dana ke rekening di atas.
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100/80 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold">Total tagihan:</span>
                      <span className="font-bold text-gray-800">Rp {checkoutAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold">Saldo Tersedia:</span>
                      <span className={coopBalance < checkoutAmount ? "text-rose-600 font-bold" : "text-emerald-800 font-bold"}>
                        Rp {coopBalance.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={handleCloseCheckout}
                    className="flex-1 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-xs cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handlePayZakat}
                    disabled={paymentMethod === "bank_transfer" && !transferConfirmed}
                    className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-center shadow-md shadow-emerald-800/10"
                  >
                    Tunaikan Sekarang
                  </button>
                </div>
              </>
            )}

            {/* Success popup dialog */}
            {paymentStatus === "success" && (
              <div className="text-center p-2 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-md">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Donasi Berhasil Walhamdulillah
                  </span>
                  <h4 className="text-base font-black text-emerald-950 mt-1">Transaksi Diterima Bank MWC</h4>
                </div>

                {/* Receipt visual card */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-2 text-xs text-left relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-100/35 rounded-bl-[40px] flex items-center justify-center font-bold text-emerald-800/20 text-2xl select-none">
                    NU
                  </div>
                  
                  <div className="space-y-1.5 text-gray-600 font-semibold">
                    <div className="flex justify-between">
                      <span>Metode:</span>
                      <span className="font-bold text-emerald-950 uppercase">{paymentMethod === "saldo" ? "Potong Saldo Koperasi" : "Transfer Bank MWCNU"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waktu:</span>
                      <span className="font-mono text-[10px] text-gray-800">Hari ini, {new Date().toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"})} WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>No Referensi:</span>
                      <span className="font-mono text-[10px] text-gray-800 font-bold uppercase">NU-BSIP-{Math.floor(Math.random()*899999 + 100000)}</span>
                    </div>
                    
                    <hr className="border-dashed border-gray-200 my-1" />
                    
                    <div className="flex justify-between mt-1 text-emerald-900 font-black">
                      <span>Dana Tersalur:</span>
                      <span>Rp {checkoutAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-center text-emerald-800 font-extrabold italic bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 mt-3 leading-tight">
                    "Allohumma thohhir qolbii minal nifaaqi wa 'amalii minar-riyaa'. Semoga berkah bagi keluarga & diredhai Allah S.W.T."
                  </p>
                </div>

                <button
                  onClick={handleCloseCheckout}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md"
                >
                  Selesai & Tutup
                </button>
              </div>
            )}

            {/* Failed popup dialog */}
            {paymentStatus === "failed" && (
              <div className="text-center p-2 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-md">
                  <span className="text-2xl font-black">✕</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Donasi Gagal Diproses
                  </span>
                  <h4 className="text-base font-black text-rose-950 mt-1">Kesalahan Aliran Keuangan</h4>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-left space-y-2">
                  <p className="text-xs font-bold text-rose-800">Metode: {paymentMethod === "saldo" ? "Satu Saldo Koperasi Warga" : "Transfer Bank MWCNU"}</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                    {errorMessage || "Mohon maaf, terjadi gangguan otorisasi transaksi pada sirkulasi aset utama Pondok Aren."}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPaymentStatus("idle");
                      setPaymentMethod("bank_transfer");
                    }}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Ganti Metode
                  </button>
                  <button
                    onClick={handleCloseCheckout}
                    className="flex-1 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                  >
                    Tutup Dialog
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
