import React, { useState, useEffect } from "react";
import { 
  Users, 
  Heart, 
  Landmark, 
  BookOpen, 
  Calendar, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  FolderPlus, 
  DollarSign, 
  Trash2,
  BookmarkCheck,
  Send,
  Handshake,
  ThumbsUp,
  ThumbsDown,
  UserCheck
} from "lucide-react";
import { UserProfile, FatwaItem, AgendaEvent, CoopProduct, LoanApplication } from "../types";
import { addNotification } from "../utils/notifications";

interface AdminViewProps {
  coopBalance: number;
  onModifyBalance: (amount: number) => void;
  currentUserProfile: UserProfile;
}

interface AdminQuestion {
  id: string;
  senderName: string;
  questionText: string;
  submittedAt: string;
  kyaiName: string;
  status: "Menunggu" | "Terjawab";
  answerText?: string;
  repliedAt?: string;
}

export default function AdminView({ coopBalance, onModifyBalance, currentUserProfile }: AdminViewProps) {
  // Active internal subtab in Admin workspace
  const [subTab, setSubTab] = useState<"dashboard" | "anggota" | "fatwa" | "koperasi" | "agenda">("dashboard");

  // Local states that synchronize with localStorage or fallbacks
  const [members, setMembers] = useState<any[]>([]);
  const [fatwas, setFatwas] = useState<FatwaItem[]>([]);
  const [coopItems, setCoopItems] = useState<CoopProduct[]>([]);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  
  // Sharia Loan Applications
  const [loanApps, setLoanApps] = useState<LoanApplication[]>([]);
  const [activeCoopSec, setActiveCoopSec] = useState<"produk" | "pinjaman">("produk");

  // Search and filter states
  const [memberSearch, setMemberSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("SEMUA");

  // Input states for new items
  const [newFatwaTitle, setNewFatwaTitle] = useState("");
  const [newFatwaCategory, setNewFatwaCategory] = useState<"Ibadah" | "Muamalah" | "Munakahat">("Ibadah");
  const [newFatwaStatus, setNewFatwaStatus] = useState<"Tuntas" | "Draft">("Tuntas");
  const [newFatwaSource, setNewFatwaSource] = useState("Lajnah Bahtsul Masail");

  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImg, setNewProdImg] = useState("");
  const [newProdLabel, setNewProdLabel] = useState("");

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState(""); // DD
  const [newEventMonth, setNewEventMonth] = useState(""); // Month name (e.g. Nov)
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventType, setNewEventType] = useState<"UTAMA" | "REGULER">("REGULER");
  const [newEventDesc, setNewEventDesc] = useState("");

  // Kyai reply state
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [kyaiReplyText, setKyaiReplyText] = useState("");
  const [selectedKyaiName, setSelectedKyaiName] = useState("KH. Ahmad Fauzi");

  // Success alerts or notifications
  const [alertMsg, setAlertMsg] = useState("");

  // Load datasets on startup
  useEffect(() => {
    // 1. Members
    const savedMembers = localStorage.getItem("nu_admin_members");
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    } else {
      const defaultMembers = [
        {
          id: "mem-1",
          fullName: "Ahmad Fauzi",
          emailOrPhone: "ahmad@domain.com",
          status: "AKTIF",
          joinedDate: "12 Jan 2021",
          memberType: "Anggota Biasa",
          nia: "31.71.01.2023.00451",
          city: "Jakarta Pusat",
          avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu6acJ-RbECn45HDXQBnQRGDRuPAUTjaXuiK0cMvpyBOsZu4eWn391CrMRkjPY5O1_sa6hd9LQ1hIy43KSW5Tqz1x0n31qT39ONUFyBKKhZsVbCcnLMUmfurLGSDpGadd3rvtIUCQT3Q0mMxEmj-8HmGBSi0o4d3doiUNOzTU4BVZJZ-JRYZa3xme-PlXEcjuiUPGqnZ9Kjy54A49msfAmqxo2Wq3-1XbhbTP9sd9wQ_E-Sf2LQMnKBQXsHvu35-TQox_3PhjAL3UK",
          coopBalance: 4250000,
        },
        {
          id: "mem-2",
          fullName: "Haji Sulaiman",
          emailOrPhone: "08123456789",
          status: "AKTIF",
          joinedDate: "15 Mar 2022",
          memberType: "Pengurus MWC",
          nia: "31.71.02.2022.00892",
          city: "Semarang",
          avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaBWmlbFrwldAMVMdZvh_2r1DANSNvYo03l_0dhU7Z6LoNORSfTq3S0W0E-cbhamz3IqS6T0spsr_o-pDw_dkXzehjgcqv0Ucb5BNr0XsNSlFZB7eczzNCjR-BvDAYPmpms3hgmNxGRiwNWEvX7wc0SCpiD3bYgIw_oB7dwmDhXQ_u1uRYYlfhoW1bzRXxM1AXSwqxrlL1cTugsBwOInhoez4_GrwoYfU_rV0cY77YlSHSINKA4LPS3LvGFzvr0ySRa55jV2gvQQa0",
          coopBalance: 12500000,
        },
        {
          id: "mem-3",
          fullName: "Aminah Khadijah",
          emailOrPhone: "aminah@lajnah.id",
          status: "PENDING",
          joinedDate: "19 Mei 2026",
          memberType: "Anggota Biasa",
          nia: "PROSES VERIFIKASI",
          city: "Surabaya",
          avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJuZTtResjIAjBsh_LHOkwCX0Z12ZI_NhW4FVY63Iha5YXSGhJrTGSjrH4I_dOafApUWzko7JWM8-q6vuXCmBaKs6yPlUnJCHK0GnSkeuuXAXvfyJ7SrhBX39ouXDeWSPtZozNO-Gg5njC6YdRN4Ji_Rb-fvLDr4jAdQeWVyu5U5HueakEzQcdMetX5uuFsV9vasGA4ffFyEUXCfDuH32TdAqJLevm_UpZ1ti29SADDqen0dkvUN3TiulxDJwHe_Ho7IrkncRD_rqT",
          coopBalance: 0,
        },
        {
          id: "mem-4",
          fullName: "Zainal Abidin",
          emailOrPhone: "zainal@muslim.org",
          status: "TIDAK AKTIF",
          joinedDate: "05 Des 2023",
          memberType: "Partisipan",
          nia: "TIDAK ADA",
          city: "Sleman",
          avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaS-Snh8pnTr7VQ3yEASKOvDcFUC7wL1x4tfEoZj3yDBdpUUEzhEicKr5jmVe_i0epcvCiyB_bZuaHfp9qlCJxBLUCaGYdfz-We5UDn6NjmrM1X46COQWFTEL58pXAhmWBjrSoVxs_ndfGdvauvht9FQPgFgiBghczdWPVSmPUtGAC5P-Q0jN2hMx1YkK80SzBHWs4mUVy1hVPPM8Lg5AMbebA5FL-Q_IiJZEsrYe0v642F0s2srWRIzk_1qFiJnOUnY3Xluj7LvPL",
          coopBalance: 50000,
        }
      ];
      setMembers(defaultMembers);
      localStorage.setItem("nu_admin_members", JSON.stringify(defaultMembers));
    }

    // 2. Fatwas
    const savedFatwas = localStorage.getItem("nu_admin_fatwas");
    if (savedFatwas) {
      setFatwas(JSON.parse(savedFatwas));
    } else {
      import("../mockData").then((m) => {
        setFatwas(m.fatwaCatalog);
        localStorage.setItem("nu_admin_fatwas", JSON.stringify(m.fatwaCatalog));
      });
    }

    // 3. Cooperative store items
    const savedCoop = localStorage.getItem("nu_admin_coop");
    if (savedCoop) {
      setCoopItems(JSON.parse(savedCoop));
    } else {
      import("../mockData").then((m) => {
        setCoopItems(m.coopProducts);
        localStorage.setItem("nu_admin_coop", JSON.stringify(m.coopProducts));
      });
    }

    // 4. Agenda Events
    const savedEvents = localStorage.getItem("nu_admin_events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      import("../mockData").then((m) => {
        setEvents(m.agendaCatalog);
        localStorage.setItem("nu_admin_events", JSON.stringify(m.agendaCatalog));
      });
    }

    // 5. Tanya Kyai Register
    const savedQuestions = localStorage.getItem("nu_admin_questions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      const defaultQuestions: AdminQuestion[] = [
        {
          id: "q-1",
          senderName: "Wawan Hermawan",
          questionText: "Ustadz, apakah sah wudhu menggunakan air tandon yang terkena kotoran cicak berukuran kecil namun baunya tidak berubah?",
          submittedAt: "21 Mei 2026, 14:20",
          kyaiName: "KH. Syarif Hidayatullah",
          status: "Menunggu"
        },
        {
          id: "q-2",
          senderName: "Indah Purnamasari",
          questionText: "Bagaimana hukum mengangsur zakat mal bulanan melalui lembaga pemotong amil zakat resmi di kantor BUMN?",
          submittedAt: "20 Mei 2026, 09:15",
          kyaiName: "KH. Ahmad Fauzi",
          status: "Terjawab",
          answerText: "Hukumnya boleh dan sangat baik (ta'jil az-zakah), asalkan pada akhir haul dilakukan perhitungan ulang guna mencocokkan total nisab wajibnya.",
          repliedAt: "20 Mei 2026, 11:30"
        },
        {
          id: "q-3",
          senderName: "Gus Muhdor",
          questionText: "Mohon nasehat kyai, bagaimana meredam perbedaan pendapat tahlilan di desa perkotaan yang majemuk?",
          submittedAt: "19 Mei 2026, 21:05",
          kyaiName: "Nyai Hj. Siti Aminah",
          status: "Menunggu"
        }
      ];
      setQuestions(defaultQuestions);
      localStorage.setItem("nu_admin_questions", JSON.stringify(defaultQuestions));
    }

    // 6. Sharia Loans from localStorage
    const savedLoans = localStorage.getItem("nu_sharia_loans");
    if (savedLoans) {
      setLoanApps(JSON.parse(savedLoans));
    } else {
      const defaultLoans: LoanApplication[] = [
        {
          id: "LN-554182",
          fullName: "Ahmad Fauzi",
          nia: "31.71.01.2023.00451",
          address: "Pondok Aren, Gg. Damai No. 5",
          phone: "08129876543",
          job: "Guru Honorer",
          businessType: "Wirausaha Lele",
          amount: 5000000,
          purpose: "Pembelian terpal kolam dan bibit unggul",
          status: "Menunggu",
          submittedAt: "22 Mei 2026, 08:30 WIB"
        }
      ];
      setLoanApps(defaultLoans);
      localStorage.setItem("nu_sharia_loans", JSON.stringify(defaultLoans));
    }
  }, []);

  const triggerAlert = (message: string) => {
    setAlertMsg(message);
    setTimeout(() => {
      setAlertMsg("");
    }, 4000);
  };

  // State persist helpers
  const saveMembersToStorage = (updated: any[]) => {
    setMembers(updated);
    localStorage.setItem("nu_admin_members", JSON.stringify(updated));
  };

  const saveFatwasToStorage = (updated: FatwaItem[]) => {
    setFatwas(updated);
    localStorage.setItem("nu_admin_fatwas", JSON.stringify(updated));
    // Also modify the catalog dynamically if possible (read from localStorage globally in client views)
    localStorage.setItem("nu_fatwa_catalog_active", JSON.stringify(updated));
  };

  const saveCoopToStorage = (updated: CoopProduct[]) => {
    setCoopItems(updated);
    localStorage.setItem("nu_admin_coop", JSON.stringify(updated));
    localStorage.setItem("nu_coop_products_active", JSON.stringify(updated));
  };

  const saveEventsToStorage = (updated: AgendaEvent[]) => {
    setEvents(updated);
    localStorage.setItem("nu_admin_events", JSON.stringify(updated));
    localStorage.setItem("nu_agenda_catalog_active", JSON.stringify(updated));
  };

  const saveQuestionsToStorage = (updated: AdminQuestion[]) => {
    setQuestions(updated);
    localStorage.setItem("nu_admin_questions", JSON.stringify(updated));
  };

  const handleUpdateLoanStatus = (loanId: string, newStatus: "Disetujui" | "Ditolak") => {
    const updated = loanApps.map(ln => {
      if (ln.id === loanId) {
        return { ...ln, status: newStatus };
      }
      return ln;
    });
    setLoanApps(updated);
    localStorage.setItem("nu_sharia_loans", JSON.stringify(updated));

    const targetLoan = loanApps.find(ln => ln.id === loanId);
    if (targetLoan) {
      if (newStatus === "Disetujui") {
        const updatedMembers = members.map(mem => {
          if (mem.nia === targetLoan.nia || mem.fullName === targetLoan.fullName) {
            return { ...mem, coopBalance: (mem.coopBalance || 0) + targetLoan.amount };
          }
          return mem;
        });
        saveMembersToStorage(updatedMembers);

        if (currentUserProfile && (targetLoan.nia === currentUserProfile.nia || targetLoan.fullName === currentUserProfile.fullName)) {
          onModifyBalance(targetLoan.amount);
        }

        // Notification for member: Pinjaman Disetujui
        addNotification({
          title: "Pinjaman Disetujui",
          message: `Alhamdulillah! Pengajuan pinjaman Qardhul Hasan Anda (${loanId}) sebesar Rp ${targetLoan.amount.toLocaleString("id-ID")} telah DISETUJUI oleh pengurus.`,
          type: "koperasi",
          target: "anggota",
          meta: { userName: targetLoan.fullName, amount: targetLoan.amount, referenceId: loanId, status: "Disetujui" }
        });

        // Confirmation for manager
        addNotification({
          title: "Persetujuan Pinjaman",
          message: `Status pinjaman syariah ${loanId} untuk ${targetLoan.fullName} sebesar Rp ${targetLoan.amount.toLocaleString("id-ID")} telah DISETUJUI.`,
          type: "koperasi",
          target: "pengelola",
          meta: { userName: targetLoan.fullName, amount: targetLoan.amount, referenceId: loanId }
        });
      } else if (newStatus === "Ditolak") {
        // Notification for member: Pinjaman Ditolak
        addNotification({
          title: "Pinjaman Ditolak",
          message: `Afwan! Pengajuan pinjaman Qardhul Hasan Anda (${loanId}) sebesar Rp ${targetLoan.amount.toLocaleString("id-ID")} DITOLAK oleh pengurus.`,
          type: "koperasi",
          target: "anggota",
          meta: { userName: targetLoan.fullName, amount: targetLoan.amount, referenceId: loanId, status: "Ditolak" }
        });

        // Confirmation for manager
        addNotification({
          title: "Penolakan Pinjaman",
          message: `Status pinjaman syariah ${loanId} untuk ${targetLoan.fullName} sebesar Rp ${targetLoan.amount.toLocaleString("id-ID")} telah DITOLAK.`,
          type: "koperasi",
          target: "pengelola",
          meta: { userName: targetLoan.fullName, amount: targetLoan.amount, referenceId: loanId }
        });
      }
    }

    triggerAlert(`Status Pengajuan Pinjaman ${loanId} berhasil disetujui sebagai ${newStatus}!`);
  };

  // Actions
  const handleApproveMember = (id: string) => {
    const randomNIA = `31.71.03.2026.${Math.floor(1000 + Math.random() * 9000)}`;
    const updated = members.map(m => {
      if (m.id === id) {
        return { ...m, status: "AKTIF", nia: randomNIA, memberType: "Anggota Biasa" };
      }
      return m;
    });
    saveMembersToStorage(updated);
    triggerAlert("Pendaftaran Warga Sukses Disetujui! Kartu Anggota Digital & NIA telah diterbitkan secara otomatis.");
  };

  const handleDeclineMember = (id: string) => {
    const updated = members.map(m => {
      if (m.id === id) {
        return { ...m, status: "TIDAK AKTIF" };
      }
      return m;
    });
    saveMembersToStorage(updated);
    triggerAlert("Pertimbangan keanggotaan warga ditolak.");
  };

  const handleToggleMemberActive = (id: string) => {
    const updated = members.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === "AKTIF" ? "TIDAK AKTIF" : "AKTIF";
        return { ...m, status: nextStatus };
      }
      return m;
    });
    saveMembersToStorage(updated);
    triggerAlert("Status keaktifan warga berhasil dimutakhirkan.");
  };

  const handleCreateFatwa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFatwaTitle.trim()) return;

    const newFatwa: FatwaItem = {
      id: `fatwa-${Date.now()}`,
      title: newFatwaTitle,
      category: newFatwaCategory,
      status: newFatwaStatus,
      date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      source: newFatwaSource
    };

    const updated = [newFatwa, ...fatwas];
    saveFatwasToStorage(updated);
    setNewFatwaTitle("");
    triggerAlert("Fatwa Syariah Baru Berhasil Diterbitkan ke Warga!");
  };

  const handleDeleteFatwa = (id: string) => {
    const updated = fatwas.filter(f => f.id !== id);
    saveFatwasToStorage(updated);
    triggerAlert("Fatwa berhasil dihapus.");
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const newProduct: CoopProduct = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      price: parseInt(newProdPrice) || 0,
      imgUrl: newProdImg || "https://lh3.googleusercontent.com/aida-public/AB6AXuD1BEeO-JzTxbrbDZTefl7fGM4TNHz-SW2uwWjcHRxrPJOWGOQDNBD3EbimPnimr5GCgT9PYX5CHNkzLVebH-eyInIF5POVXRrICSypbIQNTF2ENB6jQjV9GbOQ0AVjys6UaR_JvaiyeFiuXQqewmKgv7ZWhXrcmPbIarGgLadj8TrPp8lkU2NI6KvNDcjaXSVCDADO6aBYkq1Xh_C4tAqmUac1RgqT8S0X7TsB6fXx-6hRjPdgKjMivA7wJC8kjOf7MwFUs89tely6",
      description: newProdDesc || "Produk bermutu dari jaringan kemandirian ekonomi Nahdlatul Ulama.",
      label: newProdLabel || undefined
    };

    const updated = [...coopItems, newProduct];
    saveCoopToStorage(updated);
    setNewProdName("");
    setNewProdPrice("");
    setNewProdDesc("");
    setNewProdImg("");
    setNewProdLabel("");
    triggerAlert("Produk baru berhasil ditambahkan ke catalog Koperasi Warga!");
  };

  const handleDeleteProduct = (id: string) => {
    const updated = coopItems.filter(p => p.id !== id);
    saveCoopToStorage(updated);
    triggerAlert("Produk Koperasi terhapus.");
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate || !newEventMonth) return;

    const newEvent: AgendaEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle,
      day: newEventDate,
      month: newEventMonth,
      time: newEventTime || "Sepanjang Hari",
      location: newEventLocation || "Aula Serbaguna NU",
      type: newEventType,
      description: newEventDesc || "Kegiatan berkah silaturahmi warga Nahdliyin guna menguatkan tali ukhuwah islamiyah."
    };

    const updated = [newEvent, ...events];
    saveEventsToStorage(updated);
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventMonth("");
    setNewEventTime("");
    setNewEventLocation("");
    setNewEventDesc("");
    triggerAlert("Agenda Acara Baru berhasil dimasukkan dalam kalender warga!");
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(ev => ev.id !== id);
    saveEventsToStorage(updated);
    triggerAlert("Kegiatan terhapus dari kalender.");
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTargetId || !kyaiReplyText.trim()) return;

    const updated = questions.map(q => {
      if (q.id === replyTargetId) {
        return {
          ...q,
          status: "Terjawab" as const,
          answerText: kyaiReplyText,
          kyaiName: selectedKyaiName,
          repliedAt: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) + " WIB"
        };
      }
      return q;
    });

    saveQuestionsToStorage(updated);
    setReplyTargetId(null);
    setKyaiReplyText("");
    triggerAlert(`Nasihat Syariah dari ${selectedKyaiName} sukses didaftarkan dan dikirimkan ke warga!`);
  };

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) || 
                          (m.nia && m.nia.toLowerCase().includes(memberSearch.toLowerCase()));
    
    if (memberFilter === "SEMUA") return matchesSearch;
    if (memberFilter === "AKTIF") return matchesSearch && m.status === "AKTIF";
    if (memberFilter === "PENDING") return matchesSearch && m.status === "PENDING";
    if (memberFilter === "TIDAK_AKTIF") return matchesSearch && m.status === "TIDAK AKTIF";
    return matchesSearch;
  });

  // Calculate dynamic stats
  const totalWarga = members.length;
  const activeWarga = members.filter(m => m.status === "AKTIF").length;
  const pendingWarga = members.filter(m => m.status === "PENDING").length;
  const totalProducts = coopItems.length;
  const unresolvedQuestions = questions.filter(q => q.status === "Menunggu").length;
  const totalZakatFund = 158500000; // Simulated collected regional charity fund

  return (
    <div className="space-y-6 pb-20 animate-fade-in font-sans">
      {/* Top Banner Alert notification */}
      {alertMsg && (
        <div className="bg-emerald-900 border border-[#fed65b] text-white p-4 rounded-2xl flex items-center gap-3 animate-bounce shadow-md">
          <ShieldCheck className="text-[#fed65b] shrink-0" size={24} />
          <div className="text-xs">
            <p className="font-extrabold text-[#fed65b] leading-none mb-0.5">Sistem Admin PWNU</p>
            <p className="font-medium text-emerald-100">{alertMsg}</p>
          </div>
        </div>
      )}

      {/* Header section with credentials info */}
      <header className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none blur-2xl"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-500 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Workspace Pengelola Utama
              </span>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 font-bold px-2 py-0.5 rounded-full">
                Sistem Terpadu
              </span>
            </div>
            <h1 className="text-xl font-black text-[#fed65b] mt-1.5 leading-none">
              Portal Syariah & Keanggotaan Admin
            </h1>
            <p className="text-[11px] text-emerald-200 mt-1 leading-normal font-medium max-w-md">
              Manajerial digital Bahtsul Masail, verifikasi KartaNU warga Nahdliyin, logistik koperasi daerah, dan kalender dakwah syiar islamiah.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-2xl text-xs backdrop-blur-md self-start sm:self-center border border-white/5">
            <p className="text-emerald-300 uppercase font-bold text-[9px]">Pengelola Aktif</p>
            <p className="font-extrabold text-sm">{currentUserProfile.fullName}</p>
            <p className="text-[9px] text-[#fed65b] font-medium mt-0.5">Admin ID: {currentUserProfile.nia}</p>
          </div>
        </div>
      </header>

      {/* Admin sub-navigation tabs */}
      <nav className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl">
        <button
          onClick={() => setSubTab("dashboard")}
          className={`flex-1 py-3 px-3 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center gap-1.5 ${
            subTab === "dashboard" ? "bg-white text-emerald-900 shadow-xs" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <TrendingUp size={14} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setSubTab("anggota")}
          className={`flex-1 py-3 px-3 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center gap-1.5 ${
            subTab === "anggota" ? "bg-white text-emerald-900 shadow-xs animate-pulse" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Users size={14} />
          <span>Keanggotaan {pendingWarga > 0 && <span className="bg-amber-500 text-amber-950 text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center font-bold">{pendingWarga}</span>}</span>
        </button>

        <button
          onClick={() => setSubTab("fatwa")}
          className={`flex-1 py-3 px-3 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center gap-1.5 ${
            subTab === "fatwa" ? "bg-white text-emerald-900 shadow-xs" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <BookOpen size={14} />
          <span>Fatwa & Tanya</span>
        </button>

        <button
          onClick={() => setSubTab("koperasi")}
          className={`flex-1 py-3 px-3 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center gap-1.5 ${
            subTab === "koperasi" ? "bg-white text-emerald-900 shadow-xs" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Landmark size={14} />
          <span>Koperasi</span>
        </button>

        <button
          onClick={() => setSubTab("agenda")}
          className={`flex-1 py-3 px-3 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center gap-1.5 ${
            subTab === "agenda" ? "bg-white text-emerald-900 shadow-xs" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Calendar size={14} />
          <span>Agenda</span>
        </button>
      </nav>

      {/* Subtab Contents routing */}
      
      {/* 1. DASHBOARD OVERVIEW */}
      {subTab === "dashboard" && (
        <div className="space-y-6 animate-scale-up">
          {/* Bento stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-gray-400 font-extrabold text-[9px] uppercase tracking-wider">Total Warga</span>
              <p className="text-2xl font-black text-gray-800 tracking-tight mt-1">{totalWarga}</p>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">● {activeWarga} Berstatus Aktif</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-extrabold text-[9px] uppercase tracking-wider">Verifikasi KartaNU</span>
                {pendingWarga > 0 && <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-ping">Pending</span>}
              </div>
              <p className="text-2xl font-black text-amber-600 tracking-tight mt-1">{pendingWarga}</p>
              <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Menunggu Konfirmasi</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-gray-400 font-extrabold text-[9px] uppercase tracking-wider">Pertanyaan Kyai</span>
              <p className="text-2xl font-black text-emerald-800 tracking-tight mt-1">{unresolvedQuestions}</p>
              <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Perlu Jawaban Batin</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-gray-400 font-extrabold text-[9px] uppercase tracking-wider">Kas Zis regions</span>
              <p className="text-lg font-black text-emerald-900 tracking-tight mt-2">Rp {totalZakatFund.toLocaleString("id-ID")}</p>
              <span className="text-[10px] text-gray-400 font-semibold mt-1 block">NU Care-LAZISNU digital</span>
            </div>
          </div>

          {/* Simulated Financial Trend Chart */}
          <section className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <div>
                <h3 className="font-extrabold text-[#00450d] text-sm">Visualisasi Zis & Simpanan Daerah</h3>
                <p className="text-gray-400 font-semibold mt-0.5 text-[10px]">Tingkat himpunan dana warga virtual 4 bulan terakhir</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">Realtime Audit</span>
            </div>

            {/* Custom SVG indicator bars */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-gray-650">
                  <span className="font-bold flex items-center gap-1">🟢 Zakat Fitrah (Simulasi)</span>
                  <span className="font-bold">Rp 64.200.000</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-700 h-full rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-gray-650">
                  <span className="font-bold flex items-center gap-1">🟠 Infaq Kemanusiaan NU Care</span>
                  <span className="font-bold">Rp 48.950.000</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "55%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-gray-650">
                  <span className="font-bold flex items-center gap-1">🔵 Total Aset Koperasi Warga</span>
                  <span className="font-bold">Rp {coopBalance.toLocaleString("id-ID")}</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-650 h-full rounded-full bg-sky-600" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-400 font-semibold">Tindakan Cepat Dana Koperasi:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    onModifyBalance(50000);
                    triggerAlert("Kas Koperasi disimulasi disuntik dana Rp 50.000.");
                  }}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 text-emerald-800 rounded-lg font-bold text-[10px]"
                >
                  + Tambah Rp 50rb
                </button>
                <button 
                  onClick={() => {
                    onModifyBalance(-100000);
                    triggerAlert("Kas Koperasi dikurangi Rp 100.000 untuk pengadaan barang.");
                  }}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-150 text-red-800 rounded-lg font-bold text-[10px]"
                >
                  - Ambil Rp 100rb
                </button>
              </div>
            </div>
          </section>

          {/* Quick Action Guides */}
          <section className="bg-gray-50 p-5 rounded-[24px] border border-gray-200/60 flex items-center gap-4 text-xs">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800">Petunjuk Penggunaan Sistem:</p>
              <p className="text-gray-500 mt-1 leading-relaxed font-semibold">
                Setiap perubahan pada tab kelola di atas (Anggota, Fatwa baru, Cooperative items, dll.) akan langsung mengubah katalog operasional global pada aplikasi warga demi kepraktisan pengujian simulasi Anda.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* 2. DAFTAR ANGGOTA (MEMBER MANAGER) */}
      {subTab === "anggota" && (
        <div className="space-y-4 animate-scale-up">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-405 text-gray-400" size={16} />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Cari nama warga, asal, atau NIA..."
                className="w-full bg-white border border-gray-200 py-2.5 pl-10 pr-4 text-xs rounded-xl focus:border-emerald-800 outline-none"
              />
            </div>
            
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-xl text-gray-700 font-extrabold outline-none"
            >
              <option value="SEMUA">Semua Status</option>
              <option value="AKTIF">Aktif</option>
              <option value="PENDING">Menunggu Verifikasi</option>
              <option value="TIDAK_AKTIF">Tidak Aktif</option>
            </select>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden text-xs">
            {filteredMembers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 leading-normal">
                Tidak ada warga terdaftar yang sesuai kriteria pencarian Anda.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredMembers.map((m) => (
                  <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-50 bg-gray-50 flex-shrink-0">
                        <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-sm text-gray-800 leading-none">{m.fullName}</p>
                          <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                            m.status === "AKTIF" ? "bg-emerald-50 text-emerald-800" :
                            m.status === "PENDING" ? "bg-amber-100 text-amber-800 animate-pulse" :
                            "bg-gray-100 text-gray-400"
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-[10px] font-semibold mt-1">
                          NIA: <span className="font-bold text-gray-600">{m.nia || "TUNTUNAN_PENDING"}</span> • {m.memberType}
                        </p>
                        <p className="text-gray-400 text-[10px] font-semibold">
                          Lokasi: <span className="font-bold text-gray-600">{m.city || "Jakarta"}</span> • Terdaftar {m.joinedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-center">
                      {m.status === "PENDING" ? (
                        <>
                          <button
                            onClick={() => handleApproveMember(m.id)}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
                          >
                            <CheckCircle2 size={13} />
                            <span>Setujui</span>
                          </button>
                          <button
                            onClick={() => handleDeclineMember(m.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
                          >
                            <XCircle size={13} />
                            <span>Tolak</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleToggleMemberActive(m.id)}
                          className={`font-semibold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors ${
                            m.status === "AKTIF" 
                              ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200" 
                              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                          }`}
                        >
                          {m.status === "AKTIF" ? "Set Nonaktif" : "Set Aktif"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CO-OP KEDAI INVENTORY (KOPERASI WIDGET) */}
      {subTab === "koperasi" && (
        <div className="space-y-6 animate-scale-up text-xs">
          {/* Section Selector Pills */}
          <div className="flex gap-2 bg-emerald-900/5 p-1 rounded-2xl w-fit border border-emerald-900/10">
            <button
              onClick={() => setActiveCoopSec("produk")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCoopSec === "produk"
                  ? "bg-emerald-800 text-white shadow-sm font-black"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Inventaris Produk Koperasi
            </button>
            <button
              onClick={() => setActiveCoopSec("pinjaman")}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeCoopSec === "pinjaman"
                  ? "bg-emerald-800 text-white shadow-sm font-black"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Verifikasi Pinjaman Syariah (Qardhul Hasan)</span>
              {loanApps.filter(ln => ln.status === "Menunggu").length > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-bounce">
                  {loanApps.filter(ln => ln.status === "Menunggu").length}
                </span>
              )}
            </button>
          </div>

          {activeCoopSec === "produk" ? (
            <div className="space-y-6">
              {/* New Item Form */}
              <form onSubmit={handleCreateProduct} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-extrabold text-[#00450d] text-sm flex items-center gap-2">
                  <FolderPlus size={18} className="text-amber-600" />
                  <span>Tambah Produk Koperasi Syariah Baru</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 text-[10px]">Nama Barang</label>
                    <input
                      required
                      type="text"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="cth. Sorban Ulama Eksklusif"
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 text-[10px]">Harga (Rupiah)</label>
                    <input
                      required
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="cth. 120000"
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 text-[10px]">Label Khusus (Opsional)</label>
                    <input
                      type="text"
                      value={newProdLabel}
                      onChange={(e) => setNewProdLabel(e.target.value)}
                      placeholder="cth. Produk NU, Terlaris"
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 text-[10px]">URL Gambar (Opsional)</label>
                    <input
                      type="text"
                      value={newProdImg}
                      onChange={(e) => setNewProdImg(e.target.value)}
                      placeholder="Kosongkan untuk barang default"
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none text-[11px]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-gray-500 text-[10px]">Deskripsi Manfaat & Asal Usul</label>
                    <textarea
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="Tuliskan spesifikasi produk, produsen santri, atau kepatuhan berkah barang agar memikat warga..."
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none h-16 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Plus size={16} /> Add to Cooperative Store
                </button>
              </form>

              {/* Current Catalog Inventory */}
              <section className="space-y-3">
                <h3 className="font-extrabold text-gray-800">Inventaris Toko Saat Ini ({totalProducts} Produk)</h3>
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {coopItems.map((prod) => (
                      <div key={prod.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-250 border-gray-100">
                            <img src={prod.imgUrl} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-extrabold text-xs text-gray-800">{prod.name}</p>
                              {prod.label && <span className="bg-emerald-50 text-emerald-800 text-[8px] font-extrabold px-1.5 rounded">{prod.label}</span>}
                            </div>
                            <p className="text-emerald-800 font-bold text-[10px] mt-0.5">Rp {prod.price.toLocaleString("id-ID")}</p>
                            <p className="text-gray-400 font-medium text-[9px] line-clamp-1 max-w-sm mt-0.5">{prod.description}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-red-650 hover:text-red-800 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50/40 border border-amber-200/50 rounded-3xl p-5 space-y-2">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
                  <Handshake className="text-amber-800 animate-pulse" size={18} />
                  <span>Verifikasi Manual Qardhul Hasan (Pinjaman Kebajikan)</span>
                </h4>
                <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                  Sesuai fatwa muamalah syariah, pembiayaan produktif Qardhul Hasan disalurkan tanpa bunga (bunga 0%) khusus untuk membantu modal usaha kecil jemaah NU Pondok Aren. Lakukan verifikasi manual data diri serta rencana penggunaan dana sebelum memberikan persetujuan (approval).
                </p>
              </div>

              {loanApps.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-gray-100 p-8 text-center text-gray-400 font-bold shadow-xs">
                  Belum ada pengajuan pinjaman syariah yang terekam di sistem.
                </div>
              ) : (
                <div className="space-y-4">
                  {loanApps.map((loan) => (
                    <div key={loan.id} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm space-y-4 relative overflow-hidden transition-all hover:border-gray-200">
                      
                      {/* Ribbon Status */}
                      <div className="absolute top-0 right-0">
                        {loan.status === "Menunggu" && (
                          <span className="bg-amber-500 text-white font-extrabold px-3 py-1 rounded-bl-xl text-[9px] uppercase tracking-wider block">
                            Menunggu Review
                          </span>
                        )}
                        {loan.status === "Disetujui" && (
                          <span className="bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-bl-xl text-[9px] uppercase tracking-wider block">
                            Selesai & Cair
                          </span>
                        )}
                        {loan.status === "Ditolak" && (
                          <span className="bg-rose-600 text-white font-extrabold px-3 py-1 rounded-bl-xl text-[9px] uppercase tracking-wider block">
                            Ditolak
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-gray-400 bg-gray-50 border border-gray-150 p-1 rounded font-bold">
                            Kode: {loan.id}
                          </span>
                          <span className="text-gray-400 font-semibold text-[10px]">Diajukan: {loan.submittedAt}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1.5">
                            <p className="text-[9px] uppercase font-black text-gray-400">Data Diri & Identitas Jemaah</p>
                            <div className="bg-gray-50/60 p-3 rounded-2xl border border-gray-100 space-y-1">
                              <p className="font-extrabold text-[12px] text-gray-800 flex items-center gap-1">
                                <span>{loan.fullName}</span>
                                {loan.nia && <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 rounded">{loan.nia}</span>}
                              </p>
                              <p className="font-semibold text-gray-600">Pekerjaan: <span className="font-extrabold text-gray-700">{loan.job}</span></p>
                              <p className="font-semibold text-gray-600">Usaha Mikro: <span className="font-extrabold text-gray-700">{loan.businessType}</span></p>
                              <p className="font-semibold text-gray-600">WhatsApp: <span className="font-extrabold text-emerald-900 underline">{loan.phone}</span></p>
                              <p className="font-semibold text-gray-500 flex items-start gap-1 text-[11px] mt-1 leading-normal">
                                <span>Alamat:</span>
                                <span className="text-gray-700 font-semibold">{loan.address}</span>
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1.5 flex flex-col justify-between">
                            <div>
                              <p className="text-[9px] uppercase font-black text-gray-400">Nominal & Alasan Rencana Modal</p>
                              <div className="bg-[#00450d]/5 p-3 rounded-2xl border border-emerald-50 space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-emerald-800">Limit Sharia Loan</span>
                                  <span className="text-[14px] font-black text-[#00450d] font-mono">
                                    Rp {loan.amount.toLocaleString("id-ID")}
                                  </span>
                                </div>
                                <p className="text-[11.5px] italic text-gray-600 leading-normal font-semibold mt-1 bg-white/70 p-2 rounded-lg border border-gray-100">
                                  "{loan.purpose}"
                                </p>
                              </div>
                            </div>

                            {loan.status === "Menunggu" && (
                              <div className="flex gap-2 pt-2 md:pt-0">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateLoanStatus(loan.id, "Disetujui")}
                                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs py-2.5 transition-all outline-none border-none cursor-pointer hover:shadow flex items-center justify-center gap-1"
                                >
                                  <ThumbsUp size={13} />
                                  <span>Setujui (Cairkan)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateLoanStatus(loan.id, "Ditolak")}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs py-2.5 px-3 transition-all hover:border-rose-300 cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <ThumbsDown size={13} />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            )}

                            {loan.status === "Disetujui" && (
                              <div className="bg-emerald-50 text-[#00450d] p-2.5 rounded-xl border border-emerald-100 text-center font-bold text-[10.5px] flex items-center justify-center gap-1">
                                <CheckCircle2 size={13} />
                                <span>Telah Manual Approved & Saldo Cair Otomatis</span>
                              </div>
                            )}

                            {loan.status === "Ditolak" && (
                              <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl border border-rose-100 text-center font-bold text-[10.5px] flex items-center justify-center gap-1">
                                <XCircle size={13} />
                                <span>Telah Ditolak Pengurus</span>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. DEWAN FATWA WORKBENCH & INBOX TANYA KYAI */}
      {subTab === "fatwa" && (
        <div className="space-y-6 animate-scale-up text-xs">
          {/* Tanya Kyai Live Workbench Inbox */}
          <section className="space-y-3">
            <h3 className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
              <MessageSquare size={18} className="text-amber-500" />
              <span>Kotak Masuk Konsultasi Tanya Kyai</span>
            </h3>

            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-extrabold text-xs text-gray-800">{q.senderName}</p>
                      <p className="text-gray-400 font-medium text-[9px] mt-0.5">Diajukan: {q.submittedAt}</p>
                    </div>
                    <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      q.status === "Terjawab" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-amber-50 text-amber-800 border border-amber-200 animate-pulse"
                    }`}>
                      {q.status}
                    </span>
                  </div>

                  <p className="text-gray-650 italic font-semibold text-xs leading-relaxed bg-gray-50/75 p-3 rounded-xl border border-gray-100">
                    "{q.questionText}"
                  </p>

                  <div className="text-[10px] text-gray-400 font-semibold">
                    Target Konsulen: <span className="font-bold text-emerald-800">{q.kyaiName}</span>
                  </div>

                  {q.status === "Terjawab" ? (
                    <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 space-y-1 mt-2">
                      <p className="font-extrabold text-emerald-990 font-bold text-emerald-900 text-[10px] flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-700" />
                        <span>Nasihat {q.kyaiName} ({q.repliedAt}):</span>
                      </p>
                      <p className="text-gray-700 font-medium">{q.answerText}</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setReplyTargetId(q.id);
                          setSelectedKyaiName(q.kyaiName);
                          setKyaiReplyText("");
                        }}
                        className="bg-amber-400 hover:bg-amber-500 text-emerald-990 font-extrabold text-[10px] px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95"
                      >
                        Beri Jawaban Batiniah Sekarang
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Reply Dialog overlay and text entry */}
          {replyTargetId && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <form onSubmit={handleSubmitResponse} className="bg-white rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-scale-up">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h4 className="text-sm font-extrabold text-emerald-900">Susun Jawaban Sebagai Kyai</h4>
                  <button 
                    type="button" 
                    onClick={() => setReplyTargetId(null)}
                    className="text-gray-400 hover:border-gray-300 font-black text-sm"
                  >
                    ⛔ Batalkan
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-500 text-[10px]">Nama Kyai yang Menjawab</label>
                  <select
                    value={selectedKyaiName}
                    onChange={(e) => setSelectedKyaiName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold my-1"
                  >
                    <option value="KH. Ahmad Fauzi">KH. Ahmad Fauzi (Fikih Muamalah)</option>
                    <option value="Nyai Hj. Siti Aminah">Nyai Hj. Siti Aminah (Keluarga)</option>
                    <option value="KH. Syarif Hidayatullah">KH. Syarif Hidayatullah (Ibadah murni)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-500 text-[10px]">Teks Nasihat Syariat / Hukum Fiqih</label>
                  <textarea
                    required
                    rows={4}
                    value={kyaiReplyText}
                    onChange={(e) => setKyaiReplyText(e.target.value)}
                    placeholder="Awali dengan salam syar'i. Berikan rujukan hukum, anjuran akhlak, atau kutipan madzhab Syafi'i untuk membimbing ketenangan batiniah warga..."
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none text-xs leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5"
                >
                  <Send size={14} />
                  <span>Kirimkan Jawaban Resmi</span>
                </button>
              </form>
            </div>
          )}

          {/* New Fatwa creation publisher */}
          <form onSubmit={handleCreateFatwa} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm space-y-4 mt-8">
            <h3 className="font-extrabold text-[#00450d] text-sm flex items-center gap-2">
              <BookmarkCheck size={18} className="text-emerald-800" />
              <span>Publikasikan Fatwa Bahtsul Masail Baru</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-gray-500 text-[10px]">Judul Pembahasan Fatwa</label>
                <input
                  required
                  type="text"
                  value={newFatwaTitle}
                  onChange={(e) => setNewFatwaTitle(e.target.value)}
                  placeholder="cth. Fatwa Hukum Pembayaran Fidiyah Menggunakan Dompet Digital"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 text-[10px]">Kategori Pembidangan</label>
                <select
                  value={newFatwaCategory}
                  onChange={(e) => setNewFatwaCategory(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none font-bold"
                >
                  <option value="Ibadah">Ibadah</option>
                  <option value="Muamalah">Muamalah</option>
                  <option value="Munakahat">Munakahat</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 text-[10px]">Status Terbitan</label>
                <select
                  value={newFatwaStatus}
                  onChange={(e) => setNewFatwaStatus(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none font-bold"
                >
                  <option value="Tuntas">Tuntas (Bisa diakses warga)</option>
                  <option value="Draft">Draft (Dalam Kajian Bahtsul)</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-gray-500 text-[10px]">Sumber Musyawarah / Lajnah Aliansi</label>
                <input
                  type="text"
                  value={newFatwaSource}
                  onChange={(e) => setNewFatwaSource(e.target.value)}
                  placeholder="cth. PWNU Jawa Timur / Dewan Syuriah"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Plus size={16} /> Publikasikan Pengumuman Fatwa
            </button>
          </form>

          {/* Current Fatwa Database */}
          <section className="space-y-3">
            <h3 className="font-extrabold text-gray-800">Daftar Fatwa Publikasi</h3>
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {fatwas.map((f) => (
                  <div key={f.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-800 px-2 rounded-full border border-amber-100">{f.category}</span>
                        <span className={`text-[8px] font-bold ${f.status === "Tuntas" ? "text-emerald-700" : "text-gray-400"}`}>● {f.status}</span>
                      </div>
                      <p className="font-bold text-xs text-gray-800 mt-1.5 leading-snug">{f.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{f.source} • {f.date}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteFatwa(f.id)}
                      className="text-red-650 hover:text-red-800 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 5. AGENDA ACARA CALENDAR LOGGER */}
      {subTab === "agenda" && (
        <div className="space-y-6 animate-scale-up text-xs">
          {/* Create Event Form */}
          <form onSubmit={handleCreateEvent} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#00450d] text-sm flex items-center gap-2">
              <Calendar size={18} className="text-[#fed65b] fill-[#fed65b]/20" />
              <span>Jadwalkan Syiar & Agenda Acara Wilayah</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-gray-500 text-[10px]">Nama Kegiatan/Acara</label>
                <input
                  required
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="cth. Istighosah Kubro & Pengajian Malam Jumat"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 text-[10px]">Tanggal (Angka)</label>
                <input
                  required
                  type="text"
                  maxLength={2}
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  placeholder="cth. 07"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 text-[10px]">Bulan (Singkatan)</label>
                <input
                  required
                  type="text"
                  maxLength={3}
                  value={newEventMonth}
                  onChange={(e) => setNewEventMonth(e.target.value)}
                  placeholder="cth. Nov"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 text-[10px]">Jam / Waktu Acara</label>
                <input
                  type="text"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  placeholder="cth. 19:30 - Selesai"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 text-[10px]">Lokasi Penyelenggaraan</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="cth. Masjid Agung Jami PWNU"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 text-[10px]">Klasifikasi Kegiatan</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl outline-none font-bold"
                >
                  <option value="REGULER">REGULER (Syiar Umum / Cabang)</option>
                  <option value="UTAMA">UTAMA (Muktamar / Skala Nasional)</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-gray-500 text-[10px]">Deskripsi Singkat / Rincian Acara</label>
                <textarea
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Tuliskan penceramah utama/Kyai pengasuh, ketentuan pakaian, target jamaah..."
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none h-16 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Plus size={16} /> Daftarkan Acara ke Kalender
            </button>
          </form>

          {/* Current Calendar roster */}
          <section className="space-y-3">
            <h3 className="font-extrabold text-gray-800">Kalender Acara Terdaftar</h3>
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {events.map((ev) => (
                  <div key={ev.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex flex-col justify-center items-center shrink-0 border border-emerald-100 text-[#00450d]">
                        <span className="text-sm font-black leading-none">{ev.day}</span>
                        <span className="text-[8px] font-extrabold uppercase mt-0.5">{ev.month}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-extrabold text-xs text-gray-800">{ev.title}</p>
                          <span className={`text-[7px] font-extrabold px-1.5 rounded uppercase ${
                            ev.type === "UTAMA" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"
                          }`}>{ev.type}</span>
                        </div>
                        <p className="text-gray-400 text-[10px] font-semibold mt-0.5">⏱️ {ev.time} • 📍 {ev.location}</p>
                        <p className="text-gray-450 text-[10px] leading-normal line-clamp-1 mt-0.5">{ev.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="text-red-650 hover:text-red-800 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
