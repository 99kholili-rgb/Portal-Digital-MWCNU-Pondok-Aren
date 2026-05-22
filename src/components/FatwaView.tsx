import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowDownToLine, Eye, Send, FileText } from "lucide-react";
import { FatwaItem } from "../types";
import { fatwaCatalog } from "../mockData";

interface FatwaViewProps {
  onSuggestQuestion: (q: string) => void;
}

export default function FatwaView({ onSuggestQuestion }: FatwaViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFatwas, setActiveFatwas] = useState<FatwaItem[]>([]);
  
  // Custom Fatwa Question submit Form
  const [customQuestion, setCustomQuestion] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nu_admin_fatwas") || localStorage.getItem("nu_fatwa_catalog_active");
    if (saved) {
      try {
        setActiveFatwas(JSON.parse(saved));
      } catch (e) {
        setActiveFatwas(fatwaCatalog);
      }
    } else {
      setActiveFatwas(fatwaCatalog);
    }
  }, []);

  const filteredFatwas = activeFatwas.filter((fatwa) => {
    const matchesSearch = fatwa.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? fatwa.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onSuggestQuestion(customQuestion);
      setCustomQuestion("");
      setIsSubmitted(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Search Input */}
      <section className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari Fatwa Bahtsul Masail..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-12 text-sm focus:bg-white focus:border-emerald-850 outline-none transition-all"
        />
        <div className="absolute inset-y-0 right-4 flex items-center text-emerald-800 pointer-events-none">
          <SlidersHorizontal size={18} />
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative h-40 rounded-3xl overflow-hidden shadow-sm group">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiNQTJuD-bkc0UYtDEurX_SWDeOP1YCPht0KO26d7Owxpi4wsET-3cBTGQHjzspZaiEkSrUugN3giMBad4Fdiwz2DV54J1HpgH2qnA1kRalaCknIwUq7n_mb0GwThPwN255cwgpjDD5rm8wlyT-OIQ_7mxkV46NZsc_5Z5hPRtx-Kc3BwiH8BTlB5FOoIgIYLwA0iRXdN36bw0y2nClwpyDDfskwCxwLfrR8GsXFSrK80CZog-5iw2b-gGRnEPsCsfu8B51e1CM8pE"
          alt="Topik Bahtsul Masail"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 to-transparent p-6 flex flex-col justify-end">
          <span className="text-[#fed65b] font-bold text-[10px] tracking-wider uppercase mb-1">
            Topik Utama
          </span>
          <h2 className="text-white font-extrabold text-lg leading-tight">
            Bahtsul Masail Ramadhan
          </h2>
        </div>
      </section>

      {/* Categories Bento grid */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-emerald-905 text-base text-emerald-900">Kategori Fatwa</h3>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveCategory(activeCategory === "Ibadah" ? null : "Ibadah")}
            className={`p-5 rounded-[24px] flex flex-col justify-between items-start text-left transition-all border ${
              activeCategory === "Ibadah"
                ? "bg-emerald-800 text-white border-emerald-800"
                : "bg-gray-50 text-gray-800 border-gray-100 hover:bg-gray-100"
            }`}
          >
            <div className={`p-2 rounded-full ${activeCategory === "Ibadah" ? "bg-white/20" : "bg-emerald-50"}`}>
              <span className={`text-xs font-bold ${activeCategory === "Ibadah" ? "text-white" : "text-emerald-850"}`}>
                🕌
              </span>
            </div>
            <div className="mt-4">
              <p className="font-bold text-sm">Ibadah</p>
              <p className={`text-[10px] font-semibold ${activeCategory === "Ibadah" ? "text-emerald-200" : "text-gray-400"}`}>
                142 Fatwa
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveCategory(activeCategory === "Muamalah" ? null : "Muamalah")}
            className={`p-5 rounded-[24px] flex flex-col justify-between items-start text-left transition-all border ${
              activeCategory === "Muamalah"
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-gray-50 text-gray-800 border-gray-100 hover:bg-gray-100"
            }`}
          >
            <div className={`p-2 rounded-full ${activeCategory === "Muamalah" ? "bg-white/20" : "bg-amber-50"}`}>
              <span className={`text-xs font-bold ${activeCategory === "Muamalah" ? "text-white" : "text-amber-700"}`}>
                💵
              </span>
            </div>
            <div className="mt-4">
              <p className="font-bold text-sm">Muamalah</p>
              <p className={`text-[10px] font-semibold ${activeCategory === "Muamalah" ? "text-amber-100" : "text-gray-400"}`}>
                89 Fatwa
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveCategory(activeCategory === "Munakahat" ? null : "Munakahat")}
            className={`col-span-2 p-5 rounded-[24px] flex items-center justify-between transition-all border ${
              activeCategory === "Munakahat"
                ? "bg-emerald-900 text-white border-emerald-900"
                : "bg-gray-50 text-gray-800 border-gray-100 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${activeCategory === "Munakahat" ? "bg-white/20" : "bg-teal-50"}`}>
                <span className="text-xl">💚</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Munakahat</p>
                <p className={`text-[10px] font-semibold leading-normal ${
                  activeCategory === "Munakahat" ? "text-emerald-200" : "text-gray-400"
                }`}>
                  Hukum pernikahan dan keluarga Sakinah
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Fatwa List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-emerald-905 text-base text-emerald-900">Fatwa Terbaru</h3>
          <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded">
            {filteredFatwas.length} Hasil
          </span>
        </div>

        <div className="space-y-3">
          {filteredFatwas.map((fatwa) => (
            <div
              key={fatwa.id}
              className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 hover:border-emerald-800/40 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2.5 py-0.5 font-bold text-[10px] rounded-full uppercase tracking-wider ${
                  fatwa.status === "Tuntas" 
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {fatwa.status}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">{fatwa.date}</span>
              </div>
              
              <h4 className="font-bold text-sm text-gray-800 mb-3 leading-snug">
                {fatwa.title}
              </h4>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <FileText size={14} className="text-amber-600" />
                  <span className="font-medium">{fatwa.source}</span>
                </div>
                
                {fatwa.status === "Tuntas" ? (
                  <button 
                    onClick={() => onSuggestQuestion(fatwa.title)}
                    className="text-emerald-800 hover:text-emerald-950 flex items-center gap-1 font-bold"
                  >
                    <span>Ajukan Diskusi</span>
                    <Eye size={14} />
                  </button>
                ) : (
                  <button 
                    disabled 
                    className="text-gray-400 flex items-center gap-1 font-semibold"
                  >
                    <span>Masih Draft</span>
                    <ArrowDownToLine size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredFatwas.length === 0 && (
            <div className="text-center p-8 bg-gray-50/50 rounded-[24px] text-gray-400 text-xs">
              Tidak ada fatwa yang sesuai dengan pencarian Anda.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-900 p-6 rounded-[24px] text-center space-y-4">
        <h3 className="font-bold text-white text-base">Punya Masalah Fiqih?</h3>
        <p className="text-xs text-emerald-100 max-w-sm mx-auto leading-relaxed">
          Kirimkan hukum atau problematika syariah yang Anda hadapi ke tim Bahtsul Masail untuk mendapat kajian komprehensif.
        </p>
        
        <form onSubmit={handleSubmitQuestion} className="flex gap-2">
          <input
            required
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="cth. Apa hukum kurban online?"
            className="flex-1 bg-white/10 rounded-xl px-4 text-xs text-white placeholder:text-emerald-250 border border-white/10 outline-none focus:border-white/30"
          />
          <button
            type="submit"
            className="bg-[#fed65b] text-emerald-990 hover:bg-amber-400 font-bold px-4 rounded-xl flex items-center justify-center transition-colors shadow-sm text-xs py-2.5"
          >
            {isSubmitted ? "Kirim..." : <Send size={14} className="text-emerald-900" />}
          </button>
        </form>
      </section>
    </div>
  );
}
