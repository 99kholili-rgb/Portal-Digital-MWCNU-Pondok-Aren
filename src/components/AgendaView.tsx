import React, { useState } from "react";
import { AgendaEvent } from "../types";
import { agendaCatalog } from "../mockData";
import { Calendar, MapPin, Clock, Bookmark, BookmarkCheck, Plus, CheckCircle2, ChevronRight } from "lucide-react";

export default function AgendaView() {
  const [selectedDay, setSelectedDay] = useState(24);
  const [events, setEvents] = useState<AgendaEvent[]>(agendaCatalog);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["ev-1"]);

  React.useEffect(() => {
    const saved = localStorage.getItem("nu_admin_events") || localStorage.getItem("nu_agenda_catalog_active");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        setEvents(agendaCatalog);
      }
    }
  }, []);
  
  // Custom event creation states
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("25");
  const [month, setMonth] = useState("Nov");
  const [time, setTime] = useState("09:00 - Selesai");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const handleToggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bId) => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    const newEvent: AgendaEvent = {
      id: "ev-" + Date.now(),
      title,
      day: day.padStart(2, "0"),
      month,
      time,
      location,
      type: "REGULER",
      description,
    };

    setEvents([newEvent, ...events]);
    setAddSuccess(true);
    setTimeout(() => {
      setShowAddForm(false);
      setAddSuccess(false);
      setTitle("");
      setLocation("");
      setDescription("");
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Intro section */}
      <div>
        <h2 className="text-xl font-extrabold text-emerald-900 tracking-tight leading-none">
          Agenda Kegiatan
        </h2>
        <p className="text-xs text-gray-400 font-semibold mt-1.5 leading-normal">
          Jadwal acara keagamaan, munas, dan kemunawaran organisasi mendatang.
        </p>
      </div>

      {/* Horizontal Calendar days of Oct 2023 */}
      <section className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-gray-800 text-sm">Oktober 2023</span>
          <button 
            type="button" 
            onClick={() => alert("Menampilkan kalender bulanan penuh")} 
            className="text-emerald-800 hover:text-emerald-950 font-bold hover:underline"
          >
            Lihat Kalender
          </button>
        </div>

        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-6 px-6">
          {Array.from({ length: 11 }, (_, idx) => {
            const currentDayNum = 21 + idx;
            const isToday = currentDayNum === 24;
            const isSelected = selectedDay === currentDayNum;
            const dayName = daysOfWeek[(currentDayNum - 21) % 7];

            return (
              <div
                key={currentDayNum}
                onClick={() => setSelectedDay(currentDayNum)}
                className={`flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-800 text-white shadow-md scale-105"
                    : isToday 
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-100 font-bold"
                    : "bg-gray-50 text-gray-500 border border-gray-100/50 hover:bg-gray-100"
                } active:scale-95`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">{dayName}</span>
                <span className="text-base font-extrabold mt-1">{currentDayNum}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Bento Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Highlight Card 1 */}
        <div className="relative overflow-hidden rounded-[28px] bg-emerald-900 text-white p-6 shadow-xl h-[280px] flex flex-col justify-end group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwMheD58wxi6IgustAs6JRWMQ54vB6y62_BxW7y62KqLmEX7uOoPQ5ZIPfMDOyhOQg7Oz4tPMa2d6367hb_D414P0fPgUFBWQS4tqDlxmUpNPub4A5SWkzUjhxzlAm60lyDe15_nYj1qlmjD722dLNWxDZ8_J9uJ3E0ylK2iP7zTGMPcDlrvTakzCAyLLpwrPeHEPLEHyzCpGB1ghvQH4-DOIPtddENeRj5MqIGuq3OJXalguz9KvjFC2oidSBWwkdQ__oc7FgOfFg"
            alt="Muktamar NU"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-10 space-y-3">
            <span className="inline-block px-3 py-1 bg-amber-400 text-emerald-990 rounded-full font-bold text-[10px] tracking-wider uppercase">
              Utama
            </span>
            <h3 className="font-extrabold text-xl leading-snug">
              Muktamar Nasional NU
            </h3>
            <div className="flex items-center gap-4 text-xs text-emerald-100/90 font-medium">
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-[#fed65b]" />
                <span>25 - 27 Okt</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-[#fed65b]" />
                <span>Surabaya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small bento rows */}
        <div className="grid grid-rows-2 gap-4 h-[280px]">
          <div className="bg-amber-100/40 rounded-[28px] p-5 border border-amber-200/50 flex flex-col justify-between hover:shadow-xs">
            <div>
              <h4 className="font-bold text-sm text-yellow-800 uppercase tracking-wider">Harlah NU ke-101</h4>
              <p className="text-gray-500 text-xs mt-1 leading-normal font-semibold">Peringatan hari lahir di Gelora Bung Karno besar-besaran.</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-yellow-800">31 Januari 2024</span>
              <ChevronRight size={18} className="text-yellow-800" />
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-5 border border-gray-100 flex items-center gap-4 hover:shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-800 leading-snug">Pengajian Rutin Ahad</h4>
              <p className="text-[10px] text-gray-400 font-semibold leading-normal mt-0.5">Setiap Minggu Pagi • Jam 07:00 WIB • PWNU</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming list */}
      <section className="space-y-4">
        <div className="flex justify-between items-center text-xs px-1">
          <h3 className="font-bold text-emerald-905 text-base text-emerald-900">Mendatang</h3>
          <span className="text-gray-400 font-bold uppercase">{events.length} Acara Terjadwal</span>
        </div>

        <div className="space-y-3">
          {events.map((ev) => {
            const isBookmarked = bookmarkedIds.includes(ev.id);
            return (
              <div
                key={ev.id}
                className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-xs flex justify-between gap-4 hover:border-emerald-800/30 transition-all group"
              >
                <div className="flex gap-4">
                  {/* Calendar Widget box left */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-emerald-800 font-mono shrink-0 select-none">
                    <span className="text-[10px] font-bold uppercase text-gray-400 leading-none mb-0.5">{ev.month}</span>
                    <span className="text-xl font-extrabold leading-none text-emerald-800">{ev.day}</span>
                  </div>

                  {/* Convo central description */}
                  <div>
                    <h4 className="font-bold text-sm text-gray-850 text-gray-800 group-hover:text-emerald-900 transition-colors">
                      {ev.title}
                    </h4>
                    <div className="mt-2 space-y-1 text-[11px] text-gray-400 font-semibold leading-snug">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-amber-600" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-amber-600" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center shrink-0">
                  <button
                    onClick={() => handleToggleBookmark(ev.id)}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-90 ${
                      isBookmarked
                        ? "bg-emerald-50 text-emerald-850 border-emerald-100"
                        : "border-gray-200 text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={18} className="text-emerald-800" />
                    ) : (
                      <Bookmark size={18} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Action Button (FAB) for custom events */}
      <button
        onClick={() => {
          setShowAddForm(true);
          setAddSuccess(false);
        }}
        className="fixed right-6 bottom-24 w-14 h-14 rounded-2xl bg-emerald-800 text-white shadow-lg flex items-center justify-center active:scale-90 hover:bg-emerald-900 transition-all z-40"
      >
        <Plus size={24} />
      </button>

      {/* Custom event creation dialog Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-emerald-900">Buat Agenda Kegiatan Baru</h4>

            {addSuccess ? (
              <div className="text-center p-4 space-y-2 flex flex-col items-center">
                <CheckCircle2 size={48} className="text-emerald-800 animate-bounce" />
                <p className="font-bold text-emerald-900 mt-2">Agenda Berhasil Ditambahkan!</p>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Terima kasih, agenda kegiatan "{title}" telah didaftarkan dalam kalender warga secara komunal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateEvent} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Kegiatan</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="cth. Istighosah Qubro Warga"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-850 text-xs font-semibold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Tanggal</label>
                    <input
                      required
                      type="number"
                      min="1"
                      max="31"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      placeholder="cth. 28"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-850 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Bulan</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-850 text-xs font-semibold outline-none"
                    >
                      <option value="Okt">Okt</option>
                      <option value="Nov">Nov</option>
                      <option value="Des">Des</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Lokasi Acara</label>
                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="cth. Masjid Agung Darus Salam"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-850 text-xs font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Ringkasan Kegiatan</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Membahas ukhuwah islamiyah..."
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-850 text-xs font-semibold outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 border border-gray-200 text-gray-550 hover:bg-gray-50 rounded-full font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-bold text-xs"
                  >
                    Tambah Acara
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
