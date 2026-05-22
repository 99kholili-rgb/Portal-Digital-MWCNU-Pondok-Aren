import React, { useState, useEffect } from "react";
import { UserProfile, NewsItem } from "../types";
import { defaultPrayerSchedule, newsCatalog } from "../mockData";
import { Bell, Heart, Landmark, BookOpen, Compass, Award, MessagesSquare, CheckCircle, HelpCircle, Play, Youtube, Clock, ArrowUpRight, X, Share2, Send, ThumbsUp } from "lucide-react";

interface BerandaViewProps {
  profile: UserProfile;
  onChangeTab: (tab: "beranda" | "zakat" | "anggota" | "kyai" | "fatwa" | "koperasi" | "agenda") => void;
  coopBalance: number;
}

export default function BerandaView({ profile, onChangeTab, coopBalance }: BerandaViewProps) {
  const isGuest = profile?.nia === "BUKAN ANGGOTA";

  const [currentPrayer, setCurrentPrayer] = useState<{ name: string; time: string; next: string; nextTime: string }>({
    name: "Dzuhur",
    time: defaultPrayerSchedule.dzuhur,
    next: "Ashar",
    nextTime: defaultPrayerSchedule.ashar,
  });

  const [notifCount, setNotifCount] = useState(2);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<NewsItem | null>(null);
  const [newsFilter, setNewsFilter] = useState<"semua" | "artikel" | "tvnu">("semua");

  // Interactive Video Player states
  const [videoLikes, setVideoLikes] = useState<Record<string, number>>({
    "8mUN9DqX9kQ": 245,
    "p7pM-fJqyLM": 182,
    "m4_Z7E2y-0U": 312,
    "gqW-f_C6yvY": 154
  });
  const [userLikedVideos, setUserLikedVideos] = useState<Record<string, boolean>>({});
  const [videoComments, setVideoComments] = useState<Record<string, Array<{ id: string; name: string; text: string; time: string }>>>({
    "8mUN9DqX9kQ": [
      { id: "c1", name: "Slamet Rahardjo", text: "Masya Allah, berkah selalu jajaran pengurus MWCNU Pondok Aren. Terus syiarkan ajaran Aswaja Al-Nahdliyah.", time: "2 jam yang lalu" },
      { id: "c2", name: "Aminah_Tangsel", text: "Alhamdulillah sangat menyejukkan hati. Istighosah kubra ini membawa berkah untuk bangsa kita.", time: "18 jam yang lalu" },
      { id: "c3", name: "Abah H. Munir", text: "Aamiin ya rabbal 'alamiin, mantap liputan TVNU.", time: "1 hari yang lalu" }
    ],
    "p7pM-fJqyLM": [
      { id: "c1", name: "Ujang Sholihin", text: "Kajian yang lugas dan sangat mudah dipahami bagi kaum awam terkait muamalah syariah.", time: "2 hari yang lalu" },
      { id: "c2", name: "KartaNU_PondokAren", text: "Matur suwun KH. Ahmad Fauzi atas pencerahannya.", time: "3 hari yang lalu" }
    ],
    "m4_Z7E2y-0U": [
      { id: "c1", name: "Ning Khadijah", text: "Hadrah MWCNU Pondok Aren semakin luar biasa! Menggema sholawat di seluruh penjuru Tangsel.", time: "1 hari yang lalu" },
      { id: "c2", name: "H. Abdul Somad Aren", text: "Sangat khidmat Sholawatannya, semoga mendatangkan syafaat Kanjeng Nabi.", time: "3 hari yang lalu" }
    ],
    "gqW-f_C6yvY": [
      { id: "c1", name: "Fathur_Keren", text: "Sangat meriah! Seluruh santri antusias mengikuti pawai Hari Santri Nasional kemarin.", time: "4 hari yang lalu" },
      { id: "c2", name: "Ning Khadijah", text: "Santri berbakti untuk negeri! Sukses terus IPNU-IPPNU Pondok Aren.", time: "5 hari yang lalu" }
    ]
  });
  const [commentInput, setCommentInput] = useState("");
  const [activeModalTab, setActiveModalTab] = useState<"comments" | "playlist">("comments");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleLike = (videoId: string) => {
    const isLiked = !!userLikedVideos[videoId];
    setUserLikedVideos({
      ...userLikedVideos,
      [videoId]: !isLiked
    });
    setVideoLikes({
      ...videoLikes,
      [videoId]: isLiked ? videoLikes[videoId] - 1 : videoLikes[videoId] + 1
    });
    triggerToast(isLiked ? "Batal menyukai video." : "Anda menyukai video ini! ❤️");
  };

  const handleAddComment = (videoId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: "user-" + Date.now(),
      name: profile.fullName || "Warga NU",
      text: commentInput.trim(),
      time: "Baru saja"
    };

    const currentComments = videoComments[videoId] || [];
    setVideoComments({
      ...videoComments,
      [videoId]: [newComment, ...currentComments]
    });
    setCommentInput("");
    triggerToast("Komentar Anda berhasil dipublikasikan! 💬");
  };

  const handleShareVideo = (title: string) => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast(`Tautan video "${title.substring(0, 30)}..." telah disalin ke papan klip! 🔗`);
  };

  // Quick Notification simulation objects
  const mockNotifs = [
    { id: 1, title: "Iuran Bulanan Sukses", msg: "Iuran Wajib Agustus Rp 10.000 berhasil didebit." },
    { id: 2, title: "Konsultasi Bahtsul Masail", msg: "Kyai Ahmad Fauzi menjawab kegelisahan fiqih Anda." }
  ];

  const filteredCatalog = newsCatalog.filter((item) => {
    if (newsFilter === "artikel") {
      return !item.youtubeId;
    }
    if (newsFilter === "tvnu") {
      return !!item.youtubeId;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 animate-fade-in font-sans">
      {/* Top Header section */}
      <header className="flex justify-between items-center bg-white py-3 px-1 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-800 shadow-inner">
            <img src={profile.avatarUrl} alt="Avatar Warga" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${isGuest ? "bg-amber-100 text-amber-850" : "bg-emerald-50 text-emerald-800"}`}>
                {isGuest ? "Partisipan Tamu" : "Warga Aktif"}
              </span>
            </div>
            <h1 className="text-base font-extrabold text-emerald-990 leading-tight text-emerald-900 flex items-center gap-1.5 flex-wrap">
              <span>Assalamu'alaikum, {profile.fullName}</span>
              {profile.username && (
                <span className="text-[10px] font-mono text-emerald-800 font-semibold opacity-75">
                  (@{profile.username})
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifModal(true);
              setNotifCount(0);
            }}
            className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-50 transition-colors active:scale-95"
          >
            <Bell size={20} />
          </button>
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full text-[9px] font-extrabold text-white flex items-center justify-center animate-pulse">
              {notifCount}
            </span>
          )}
        </div>
      </header>

      {/* Prayer Ribbon Banner */}
      <section className="bg-emerald-900 rounded-3xl p-5 text-white relative overflow-hidden group shadow-md text-xs">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-[10px] text-[#fed65b] uppercase">
            <Compass size={14} className="animate-spin text-amber-400" />
            <span>Waktu Shalat Wilayah DKI Jakarta</span>
          </div>
          <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full font-bold">Lajnah Falakiyah</span>
        </div>

        {/* Highlighted core next check */}
        <div className="flex justify-between items-baseline pt-1">
          <div>
            <p className="text-[10px] text-emerald-200 uppercase font-semibold">Berikutnya</p>
            <p className="text-2xl font-black text-[#fed65b]">{currentPrayer.next} • {currentPrayer.nextTime}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-emerald-250 font-bold uppercase text-emerald-300">Sekarang</p>
            <p className="font-bold">{currentPrayer.name} ({currentPrayer.time})</p>
          </div>
        </div>

        {/* Small columns of all times */}
        <div className="grid grid-cols-6 gap-1 pt-4 mt-4 border-t border-white/10 text-center opacity-90 select-none">
          <div className="space-y-0.5">
            <p className="text-[9px] text-emerald-200 font-bold">Subuh</p>
            <p className="font-bold text-gray-100">{defaultPrayerSchedule.subuh}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-emerald-200 font-bold">Syuruq</p>
            <p className="font-bold text-gray-100">{defaultPrayerSchedule.terbit}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-emerald-200 font-bold">Dzuhur</p>
            <p className="font-bold text-emerald-200 font-black">{defaultPrayerSchedule.dzuhur}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-emerald-200 font-bold">Ashar</p>
            <p className="font-bold text-gray-100">{defaultPrayerSchedule.ashar}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-emerald-200 font-bold">Maghrib</p>
            <p className="font-bold text-gray-100">{defaultPrayerSchedule.maghrib}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-emerald-200 font-bold">Isya</p>
            <p className="font-bold text-gray-100">{defaultPrayerSchedule.isya}</p>
          </div>
        </div>
      </section>

      {/* Services Grid Shortcuts Menu */}
      <section className="space-y-3">
        <h3 className="font-bold text-emerald-905 text-base text-emerald-900">Layanan Syariah</h3>
        <div className="grid grid-cols-4 gap-3">
          {/* Service items */}
          <button
            onClick={() => onChangeTab("zakat")}
            className="flex flex-col items-center gap-1.5 focus:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100/60 border border-emerald-100/10 flex items-center justify-center mb-1 shadow-xs">
              <Heart size={22} className="text-emerald-850" />
            </div>
            <span className="text-[11px] font-bold text-gray-655 text-gray-600">Donasi Zakat</span>
          </button>

          {!isGuest && (
            <button
              onClick={() => onChangeTab("anggota")}
              className="flex flex-col items-center gap-1.5 focus:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100/60 border border-emerald-100/10 flex items-center justify-center mb-1 shadow-xs">
                <Compass size={22} className="text-emerald-850" />
              </div>
              <span className="text-[11px] font-bold text-gray-655 text-gray-600">KartaNU</span>
            </button>
          )}

          <button
            onClick={() => onChangeTab("kyai")}
            className="flex flex-col items-center gap-1.5 focus:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#fff9ea] border border-amber-100 text-amber-700 hover:bg-[#fff5dc] flex items-center justify-center mb-1 shadow-xs">
              <MessagesSquare size={22} className="text-amber-600 font-black" />
            </div>
            <span className="text-[11px] font-bold text-gray-655 text-gray-600">Tanya Kyai</span>
          </button>

          <button
            onClick={() => onChangeTab("fatwa")}
            className="flex flex-col items-center gap-1.5 focus:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100/60 border border-emerald-100/10 flex items-center justify-center mb-1 shadow-xs">
              <BookOpen size={22} className="text-emerald-850" />
            </div>
            <span className="text-[11px] font-bold text-gray-655 text-gray-600">Fatwa</span>
          </button>

          {!isGuest && (
            <button
              onClick={() => onChangeTab("koperasi")}
              className="flex flex-col items-center gap-1.5 focus:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100/60 border border-emerald-100/10 flex items-center justify-center mb-1 shadow-xs">
                <Landmark size={22} className="text-emerald-850" />
              </div>
              <span className="text-[11px] font-bold text-gray-655 text-gray-600">Koperasi</span>
            </button>
          )}

          <button
            onClick={() => onChangeTab("agenda")}
            className="flex flex-col items-center gap-1.5 focus:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#fff9ea] border border-amber-100 text-amber-700 hover:bg-[#fff5dc] flex items-center justify-center mb-1 shadow-xs">
              <Award size={22} className="text-amber-600" />
            </div>
            <span className="text-[11px] font-bold text-gray-655 text-gray-600">Agenda</span>
          </button>
        </div>
      </section>

      {/* Saldo Cooperasi quick widgets */}
      {!isGuest && (
        <section className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-850 text-emerald-850/80 shrink-0">
              🥇
            </div>
            <div>
              <h4 className="font-extrabold text-[#00450d] leading-none mb-0.5">Saldo Simpanan</h4>
              <p className="text-gray-400 font-semibold text-[11px]">Akumulasi saldo Koperasi warga</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm text-emerald-800">Rp {coopBalance.toLocaleString("id-ID")}</p>
            <button 
              onClick={() => onChangeTab("koperasi")}
              className="text-[10px] text-amber-700 font-bold hover:underline leading-none"
            >
              Isi Saldo
            </button>
          </div>
        </section>
      )}

      {/* Berita Utama (Latest news & TVNU) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-emerald-905 text-base text-emerald-900 leading-tight">Kabar Nahdliyin</h3>
            <p className="text-gray-400 font-semibold text-[11px] mt-0.5">Informasi & syiar dakwah terkini Pondok Aren</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-sm self-stretch sm:self-auto select-none border border-gray-200">
            <button
              onClick={() => setNewsFilter("semua")}
              className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-sm text-[11px] font-bold transition-all ${
                newsFilter === "semua" ? "bg-white text-emerald-900 shadow-xs border border-gray-100/10" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setNewsFilter("artikel")}
              className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-sm text-[11px] font-bold transition-all ${
                newsFilter === "artikel" ? "bg-white text-emerald-900 shadow-xs border border-gray-100/10" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Artikel
            </button>
            <button
              onClick={() => setNewsFilter("tvnu")}
              className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-sm text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                newsFilter === "tvnu" ? "bg-white text-emerald-900 shadow-xs border border-gray-100/10" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Youtube size={12} className="text-red-600" />
              <span>TVNU Video</span>
            </button>
          </div>
        </div>

        {/* Youtube Channel direct follow card (renders if filter is "semua" or "tvnu") */}
        {(newsFilter === "semua" || newsFilter === "tvnu") && (
          <div className="bg-gradient-to-br from-red-50 to-amber-50/20 border border-red-100 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md grow-0 shrink-0">
                <Youtube size={20} fill="currentColor" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-red-900 leading-none">TVNU Pondok Aren</h4>
                <p className="text-gray-500 text-[11px] font-semibold leading-relaxed">
                  Kanal media dakwah, kajian Aswaja, & reportase pengajian daerah Pondok Aren.
                </p>
              </div>
            </div>
            <a
              href="https://www.youtube.com/@TVNUPondokAren"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-4 py-2.5 rounded-full flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <span>Langganan @TVNUPondokAren</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        )}

        {/* Dynamic news and videos list */}
        <div className="space-y-4">
          {filteredCatalog.map((news) => {
            const isVideo = !!news.youtubeId;
            return (
              <div
                key={news.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs flex flex-col sm:flex-row group hover:shadow-md transition-shadow relative"
              >
                {/* Image panel */}
                <div 
                  onClick={() => isVideo ? setActiveVideo(news) : alert(`Artikel "${news.title}" sedang memuat konten penuh...`)}
                  className="h-44 sm:w-44 overflow-hidden relative bg-slate-100 cursor-pointer flex-shrink-0 flex items-center justify-center"
                >
                  <img
                    src={news.imgUrl}
                    alt={news.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category overlay label */}
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 font-bold text-[9px] rounded-full uppercase tracking-wider shadow-xs ${
                    isVideo ? "bg-red-600 text-white" : "bg-emerald-950 text-white"
                  }`}>
                    {news.category}
                  </span>

                  {/* Play circle overlay for Youtube videos */}
                  {isVideo && (
                    <div className="absolute inset-0 bg-black/15 flex items-center justify-center group-hover:bg-black/30 transition-colors duration-300">
                      <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                        <Play size={20} fill="currentColor" className="ml-1 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Duration overlay if present */}
                  {news.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Clock size={9} /> {news.duration}
                    </span>
                  )}
                </div>

                {/* Content info panel */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <span>{news.timeAgo}</span>
                      {isVideo && (
                        <>
                          <span className="w-1.5 h-1.5 bg-red-200 rounded-full"></span>
                          <span className="text-red-600 font-extrabold flex items-center gap-0.5">
                            VIDEO
                          </span>
                        </>
                      )}
                    </div>
                    <h4 
                      onClick={() => isVideo ? setActiveVideo(news) : alert(`Artikel "${news.title}" sedang memuat konten penuh...`)}
                      className="font-extrabold text-sm text-gray-800 leading-snug mt-1.5 cursor-pointer hover:text-emerald-900 group-hover:text-emerald-800 transition-colors"
                    >
                      {news.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3">
                    {isVideo ? (
                      <button
                        onClick={() => setActiveVideo(news)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-3.5 py-2 rounded-full text-xs font-bold leading-none flex items-center gap-1 transition-colors outline-none"
                      >
                        <Play size={10} fill="currentColor" />
                        <span>Tonton Video</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Artikel "${news.title}" sedang memuat konten penuh...`)}
                        className="text-xs text-emerald-800 font-bold hover:underline leading-none"
                      >
                        Baca Selengkapnya
                      </button>
                    )}
                    
                    {isVideo && (
                      <a
                        href={`https://www.youtube.com/watch?v=${news.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-gray-400 hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Buka YouTube</span>
                        <ArrowUpRight size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Notifications Drawer Dialog */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-emerald-900">Notifikasi Terbaru</h4>
            
            <div className="space-y-3">
              {mockNotifs.map((n) => (
                <div key={n.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <p className="font-bold text-gray-800">{n.title}</p>
                  <p className="text-gray-500 mt-1 leading-normal font-medium">{n.msg}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowNotifModal(false)}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-full font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* YouTube Video Player Modal Dialog */}
      {activeVideo && (
        <div className="fixed inset-0 bg-[#060a12]/95 backdrop-blur-md z-[9999] flex items-center justify-center p-2 sm:p-4">
          <div className="bg-[#0f1420] border border-slate-800 rounded-3xl max-w-5xl w-full flex flex-col shadow-2xl overflow-hidden animate-scale-up max-h-[92vh]">
            
            {/* Header bar */}
            <div className="px-4 py-3 bg-[#161d2d] border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Youtube className="text-red-600 animate-pulse" size={20} fill="currentColor" />
                <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-slate-300 font-extrabold uppercase">
                  <span>TVNU Pondok Aren</span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  <span className="text-red-500 font-extrabold">LIVE PLAYER</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveVideo(null);
                  setCommentInput("");
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Tutup Player"
              >
                <X size={18} />
              </button>
            </div>

            {/* Immersive player + sidebar grid split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1 min-h-0 bg-[#0a0f18]">
              
              {/* Left Column: Player Screen and Video Details */}
              <div className="lg:col-span-8 flex flex-col overflow-y-auto no-scrollbar p-4 space-y-4">
                
                {/* 16:9 Iframe Container */}
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-lg group">
                  <iframe
                    title={activeVideo.title}
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Information Header Block */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="bg-red-950/60 text-red-400 border border-red-900/40 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {activeVideo.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 rounded-md font-bold py-1 flex items-center gap-1">
                      <Clock size={11} /> Durasi: {activeVideo.duration || "N/A"}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                    {activeVideo.title}
                  </h3>

                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
                    <span>3.2K Ditonton</span>
                    <span>•</span>
                    <span>{activeVideo.timeAgo}</span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1 shrink-0 font-extrabold">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      108 Menonton Sekarang
                    </span>
                  </div>
                </div>

                {/* Interactive Interaction Buttons Bar */}
                <div className="flex flex-wrap items-center gap-2.5 border-t border-b border-slate-800/80 py-3.5">
                  <button
                    onClick={() => handleLike(activeVideo.youtubeId || "")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      userLikedVideos[activeVideo.youtubeId || ""]
                        ? "bg-red-600 text-white"
                        : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <ThumbsUp size={13} fill={userLikedVideos[activeVideo.youtubeId || ""] ? "currentColor" : "none"} />
                    <span>Suka • {videoLikes[activeVideo.youtubeId || ""] || 0}</span>
                  </button>

                  <button
                    onClick={() => handleShareVideo(activeVideo.title)}
                    className="flex items-center gap-1.5 bg-slate-800/60 text-slate-300 hover:bg-slate-800 px-4 py-2 rounded-full text-xs font-bold transition-colors"
                  >
                    <Share2 size={13} />
                    <span>Bagikan</span>
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#ff0000]/10 hover:bg-[#ff0000]/20 text-[#ff4c4c] px-4 py-2 rounded-full text-xs font-bold transition-colors ml-auto sm:ml-0"
                  >
                    <Youtube size={13} fill="currentColor" />
                    <span>Buka asli di YouTube</span>
                    <ArrowUpRight size={11} />
                  </a>
                </div>

                {/* Live Channel Description Card */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-600 text-[10px] font-extrabold text-white flex items-center justify-center">
                      TV
                    </div>
                    <span className="font-extrabold text-slate-200">Kanal TVNU Pondok Aren</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed font-semibold">
                    Saluran resmi Media MWCNU Kecamatan Pondok Aren. Dikelola langsung untuk menyebarkan kajian Fiqih Muamalah, Istighosah rutin, dokumentasi Hari Santri, serta dakwah ahlussunnah wal jamaah an-nahdliyah yang menyejukkan.
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Tabbed Sidebar (Comments & Playlist) */}
              <div className="lg:col-span-4 bg-[#0e1320] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col min-h-[320px] lg:min-h-0 overflow-hidden">
                
                {/* Internal Side Tabs buttons */}
                <div className="flex bg-[#131929] border-b border-slate-800 p-1 shrink-0">
                  <button
                    onClick={() => setActiveModalTab("comments")}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      activeModalTab === "comments"
                        ? "bg-[#182136] text-white border border-slate-800"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <MessagesSquare size={14} />
                    <span>Komentar Warga ({ (videoComments[activeVideo.youtubeId || ""] || []).length })</span>
                  </button>
                  <button
                    onClick={() => setActiveModalTab("playlist")}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      activeModalTab === "playlist"
                        ? "bg-[#182136] text-white border border-slate-800"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Compass size={14} />
                    <span>Video Lainnya</span>
                  </button>
                </div>

                {/* Tab content wrapper */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col min-h-0">
                  
                  {/* Commments View */}
                  {activeModalTab === "comments" && (
                    <div className="flex flex-col h-full flex-1">
                      
                      {/* Post Comment Form */}
                      <form
                        onSubmit={(e) => handleAddComment(activeVideo.youtubeId || "", e)}
                        className="mb-4 shrink-0 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          required
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Tulis opini sholawat/kajian..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-0 outline-none transition-colors"
                        />
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-500 text-white w-9 h-9 rounded-xl flex items-center justify-center transition-colors active:scale-95 shrink-0"
                          title="Kirim Komentar"
                        >
                          <Send size={14} />
                        </button>
                      </form>

                      {/* Comments Feed List */}
                      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {((videoComments[activeVideo.youtubeId || ""] || [])).length === 0 ? (
                          <div className="text-center py-8 text-slate-505 text-slate-500 space-y-1 text-xs">
                            <p className="font-extrabold italic">Belum ada komentar.</p>
                            <p>Jadilah warga pertama yang berkomentar!</p>
                          </div>
                        ) : (
                          (videoComments[activeVideo.youtubeId || ""] || []).map((comm) => (
                            <div
                              key={comm.id}
                              className="bg-slate-900/40 border border-slate-800/40 p-3 rounded-2xl text-xs space-y-1 hover:border-slate-850 transition-colors"
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-[#fed65b]">{comm.name}</span>
                                <span className="text-slate-500 font-medium">{comm.time}</span>
                              </div>
                              <p className="text-slate-300 font-semibold leading-normal">{comm.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Playlist View / Putar Lainnya */}
                  {activeModalTab === "playlist" && (
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Putar Video Lainnya dari TVNU
                      </p>
                      
                      {newsCatalog
                        .filter((item) => !!item.youtubeId)
                        .map((item) => {
                          const isCurrent = item.youtubeId === activeVideo.youtubeId;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                if (!isCurrent) {
                                  setActiveVideo(item);
                                  setCommentInput("");
                                }
                              }}
                              className={`p-2.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                                isCurrent
                                  ? "bg-red-950/20 border-red-900/60 text-white"
                                  : "bg-slate-900/30 border-slate-800/50 hover:bg-slate-900 text-slate-300 hover:border-slate-800"
                              }`}
                            >
                              {/* Playlist Thumbnail representation */}
                              <div className="w-16 h-11 rounded-lg overflow-hidden relative bg-black shrink-0">
                                <img
                                  src={item.imgUrl}
                                  alt={item.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                {item.duration && (
                                  <span className="absolute bottom-0.5 right-0.5 bg-black/85 text-[8px] px-1 rounded font-mono font-bold text-slate-200">
                                    {item.duration}
                                  </span>
                                )}
                                {isCurrent && (
                                  <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                                    <div className="text-[9px] font-extrabold bg-red-600 text-white px-1 py-0.5 rounded-sm">CD</div>
                                  </div>
                                )}
                              </div>

                              {/* Playlist Title description */}
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <h5 className={`text-xs font-bold leading-snug line-clamp-2 ${
                                  isCurrent ? "text-red-400" : "text-slate-200"
                                }`}>
                                  {item.title}
                                </h5>
                                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
                                  <span>{item.timeAgo}</span>
                                  {isCurrent && (
                                    <span className="text-red-400 font-extrabold text-[8px] animate-pulse">
                                      SEDANG DIPUTAR
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Embedded Floating Application Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[10000] bg-emerald-900 border border-emerald-750 text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce flex-wrap whitespace-nowrap">
          <CheckCircle size={15} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
