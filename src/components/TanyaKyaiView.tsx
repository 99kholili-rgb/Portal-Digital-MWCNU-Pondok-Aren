import React, { useState, useEffect, useRef } from "react";
import { KyaiProfile, ChatMessage } from "../types";
import { kyaiCatalog } from "../mockData";
import { Search, Edit3, Star, Sparkles, Send, ArrowLeft, Loader2, HelpCircle } from "lucide-react";

interface TanyaKyaiViewProps {
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export default function TanyaKyaiView({ initialQuestion, onClearInitialQuestion }: TanyaKyaiViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeKyai, setActiveKyai] = useState<KyaiProfile | null>(null);
  
  // Interactive Chat Thread state
  const [chats, setChats] = useState<{ [kyaiId: string]: ChatMessage[] }>({});
  const [inputMsg, setInputMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Popular Q&As
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isLoading]);

  // Handle suggested question from other pages (like Layanan Fatwa)
  useEffect(() => {
    if (initialQuestion) {
      // Find a default Kyai (e.g. KH. Syarif for Ibadah or KH. Ahmad Fauzi)
      const targetKyai = kyaiCatalog[0];
      setActiveKyai(targetKyai);
      setInputMsg(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  // Filter Kyais
  const filteredKyais = kyaiCatalog.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChatHistory = (kyaiId: string): ChatMessage[] => {
    if (chats[kyaiId]) return chats[kyaiId];
    
    // Default initial greeting if no chat history
    const nameOnly = activeKyai ? activeKyai.name : "Kyai";
    const initialGreetings: ChatMessage[] = [
      {
        id: "greet-1",
        sender: "kyai",
        text: `Assalamu'alaikum wr. wb. Ananda. Saya ${nameOnly}. Ada persoalan, kegundahan batin, atau tuntunan syariah apa yang sekiranya dapat kita kaji dan diskusikan bersama sore ini?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    return initialGreetings;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeKyai || isLoading) return;

    const userText = inputMsg;
    setInputMsg("");
    
    const kId = activeKyai.id;
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: userText,
      timestamp: timeString,
    };

    // Update state with user message
    const currentList = getChatHistory(kId);
    const updatedWithUser = [...currentList, userMsg];
    setChats((prev) => ({ ...prev, [kId]: updatedWithUser }));
    setIsLoading(true);

    // Dynamic pipe user questions straight to admin inbox queue
    try {
      const savedQ = localStorage.getItem("nu_admin_questions");
      const currentListQ = savedQ ? JSON.parse(savedQ) : [];
      const newAdminQ = {
        id: "q-usr-" + Date.now(),
        senderName: "Anda (Warga Santri)",
        questionText: userText,
        submittedAt: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + ", " + timeString,
        kyaiName: activeKyai.name,
        status: "Menunggu"
      };
      localStorage.setItem("nu_admin_questions", JSON.stringify([newAdminQ, ...currentListQ]));
    } catch(e) {
      console.warn(e);
    }

    try {
      // Connect to full-stack Express API endpoint
      const response = await fetch("/api/ask-kyai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: userText,
          history: currentList.slice(-6), // Send last few messages for conversational context
          kyaiName: activeKyai.name,
          kyaiTitle: activeKyai.title,
        }),
      });

      const data = await response.json();
      
      const kyaiMsg: ChatMessage = {
        id: "kyai-" + Date.now(),
        sender: "kyai",
        text: data.answer || "Afwan Ananda, tolong ulangi pertanyaan Anda.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChats((prev) => ({ ...prev, [kId]: [...updatedWithUser, kyaiMsg] }));
    } catch (error) {
      console.error("Error asking Kyai:", error);
      const errMsg: ChatMessage = {
        id: "err-" + Date.now(),
        sender: "kyai",
        text: "Maafkan saya Ananda, jalur batiniah spiritual sedang melambat karena kendala jaringan. Silakan sampaikan kegelisahan Anda sekali lagi.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChats((prev) => ({ ...prev, [kId]: [...updatedWithUser, errMsg] }));
    } finally {
      setIsLoading(false);
    }
  };

  // Preset Questions data
  const presetQAs = [
    {
      id: "pr-1",
      category: "Fiqih Ibadah",
      q: "Bagaimana hukum shalat di kendaraan umum?",
      a: "Shalat di atas kendaraan paut dianjurkan tetap dilaksanakan luhur menghormati waktu shalat (lihurmatil waqt). Apabila memenuhi rukun berupa berdiri menghadap kiblat dan bersujud sempurna maka sah, apabila tidak, maka wajib melakukan shalat i'adah (ulang) saat tiba di daratan menurut Madzhab Syafi'i.",
    },
    {
      id: "pr-2",
      category: "Zakat",
      q: "Cara menghitung zakat mal untuk tabungan haji",
      a: "Tabungan haji yang dimiliki perseorangan wajib dizakati apabila nominal tabungan telah mencapai nishab perak/emas (85g emas) dan telah terendap selama 1 haul penuh. Dizakati sebesar 2.5% dari saldo tabungan akhir tahun.",
    },
    {
      id: "pr-3",
      category: "Sosial",
      q: "Adab bertetangga di lingkungan perkotaan",
      a: "Toleransi tinggi, dilarang saling mengganggu (misal parkir sembarangan), sapaan ramah, dan saling menjaga privasi masing-masing, namun tetap sigap apabila tetangga membutuhkan pertolongan kemanusiaan mendesak.",
    },
  ];

  /* Back to Kyai Selection */
  if (activeKyai) {
    const chatLog = getChatHistory(activeKyai.id);
    
    return (
      <div className="flex flex-col bg-[#f8faf8] h-[calc(100vh-10rem)] md:h-[650px] rounded-[32px] overflow-hidden border border-gray-100 shadow-sm animate-scale-up">
        {/* Chat Header */}
        <header className="bg-white p-4 border-b border-gray-100 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveKyai(null);
                setIsLoading(false);
              }}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
            >
              <ArrowLeft className="text-emerald-800" size={20} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-100">
              <img src={activeKyai.image} alt={activeKyai.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-xs text-emerald-850 text-emerald-800 leading-none">{activeKyai.name}</p>
              <span className="text-[9px] font-bold text-emerald-600/90 tracking-wide uppercase">{activeKyai.category}</span>
            </div>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {chatLog.map((chat) => (
            <div
              key={chat.id}
              className={`flex flex-col max-w-[85%] ${
                chat.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl shadow-xs text-xs leading-relaxed ${
                  chat.sender === "user"
                    ? "bg-emerald-800 text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                }`}
              >
                {chat.text}
              </div>
              <span className="text-[9px] text-gray-400 mt-1 px-1 font-semibold">{chat.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold px-2">
              <Loader2 className="animate-spin text-emerald-800" size={16} />
              <span>{activeKyai.name} sedang menyusun anjuran...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Question input field */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
          <input
            required
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={isLoading}
            placeholder="Ketik pertanyaan atau permasalahan syariah..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 text-xs focus:bg-white focus:border-emerald-850 outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMsg.trim()}
            className="w-10 h-10 bg-emerald-800 text-white rounded-xl flex items-center justify-center hover:bg-emerald-900 transition-colors disabled:opacity-50 active:scale-95 shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Search & Intro */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-emerald-900 tracking-tight leading-none">
            Cari Bimbingan Spiritual
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 leading-normal">
            Temukan tuntunan moral & fatwa syariah yang shahih berdasarkan metodologi Ahlussunnah wal Jama'ah.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kyai pengasuh atau spesialisasi (ibadah, muamalah)..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-10 text-xs focus:bg-white outline-none focus:border-emerald-850 transition-all font-medium"
          />
        </div>
      </section>

      {/* Submit Question CTA Button */}
      <div className="mb-4">
        <button
          onClick={() => {
            // Default select KH. Ahmad Fauzi
            setActiveKyai(kyaiCatalog[0]);
            setInputMsg("");
          }}
          className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-emerald-990 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-xs"
        >
          <Edit3 size={16} className="text-emerald-900" />
          <span>Hubungi Bimbingan Spiritual Baru</span>
        </button>
      </div>

      {/* Main Grid: Kyais List */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-emerald-905 text-base text-emerald-900">Ulama & Kyai Pengasuh</h3>
          <span className="text-[10px] text-gray-400 font-bold uppercase">Terverifikasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredKyais.map((kyai) => (
            <div
              key={kyai.id}
              className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between hover:border-emerald-800/35 transition-all group"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-emerald-50">
                  <img src={kyai.image} alt={kyai.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-sm text-emerald-900 group-hover:text-amber-800 transition-colors">
                    {kyai.name}
                  </h4>
                  <p className="text-[9px] font-bold text-amber-700 tracking-wider uppercase mt-0.5">
                    {kyai.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-gray-400">
                    <Star className="text-amber-400 fill-amber-400" size={12} />
                    <span>{kyai.rating} ({kyai.consultations}+ Selesai)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-normal line-clamp-2 mt-3 font-medium">
                {kyai.description}
              </p>

              <button
                onClick={() => setActiveKyai(kyai)}
                className="mt-4 w-full py-2.5 bg-emerald-800 text-white hover:bg-emerald-900 rounded-full font-bold text-xs shadow-xs"
              >
                Tanya Beliau
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Preset questions & answers column */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
        {/* Popular Presets Accordion */}
        <div className="md:col-span-8 bg-emerald-900 text-white p-6 rounded-[28px] relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-4 relative z-10 text-[#fed65b]">
            <Sparkles size={16} />
            <h3 className="font-bold text-sm uppercase tracking-wider">Tanya Jawab Populer</h3>
          </div>

          <div className="space-y-4 relative z-10">
            {presetQAs.map((faq) => (
              <div 
                key={faq.id} 
                className="border-b border-white/20 pb-3 last:border-b-0 cursor-pointer"
                onClick={() => setActivePreset(activePreset === faq.id ? null : faq.id)}
              >
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] font-bold tracking-wider text-emerald-200/90 uppercase block mb-0.5">
                      {faq.category}
                    </span>
                    <span className="font-bold leading-snug hover:underline">{faq.q}</span>
                  </div>
                  <HelpCircle size={16} className="text-emerald-300 shrink-0 ml-2" />
                </div>
                {activePreset === faq.id && (
                  <p className="mt-2 text-[11px] text-emerald-100/90 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/5 animate-slide-up font-medium">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Verification seal card */}
        <div className="md:col-span-4 bg-gray-50 border border-gray-200/60 p-6 rounded-[28px] flex flex-col justify-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 shadow-sm shrink-0">
            <VerifiedSealIcon />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900 text-sm">Jawaban Terverifikasi</h4>
            <p className="text-[10px] text-gray-500 leading-normal mt-1 font-semibold">
              Setiap fatwa fiqih diproses melalui sidang Bahtsul Masail (pembahasan dewan ulama PWNU) untuk menjamin moderasi akidah Ahlussunnah wal Jama'ah.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function VerifiedSealIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
