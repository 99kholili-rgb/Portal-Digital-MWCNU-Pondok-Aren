import React, { useState, useEffect } from "react";
import { Bell, Check, CheckSquare, Trash2, Volume2, X, Package, Handshake, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppNotification, UserProfile } from "../types";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  clearAllNotificationsTable, 
  playNotificationSound 
} from "../utils/notifications";

interface NotificationCenterProps {
  profile: UserProfile | null;
  isAdminMode: boolean;
}

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: "koperasi" | "zakat" | "produk";
  target: "anggota" | "pengelola";
}

export default function NotificationCenter({ profile, isAdminMode }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"semua" | "anggota" | "pengelola">("semua");
  const [categoryFilter, setCategoryFilter] = useState<"semua" | "koperasi" | "zakat" | "produk">("semua");
  const [activeToasts, setActiveToasts] = useState<ToastItem[]>([]);

  // Reload notifications list on Mount and whenever customized event is dispatched
  const reloadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    reloadNotifications();

    const handleNewNotification = (e: Event) => {
      reloadNotifications();
      
      const customEvent = e as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        const notif = customEvent.detail;
        
        // Show an instant toast pop-up
        const newToast: ToastItem = {
          id: notif.id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          target: notif.target
        };
        
        setActiveToasts(prev => [newToast, ...prev].slice(0, 3)); // Max 3 visible at once

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
          setActiveToasts(prev => prev.filter(t => t.id !== notif.id));
        }, 4500);
      }
    };

    window.addEventListener("nu_notification_received", handleNewNotification);
    return () => {
      window.removeEventListener("nu_notification_received", handleNewNotification);
    };
  }, []);

  // Filter notifications
  const filteredNotifs = notifications.filter(notif => {
    // Audience boundary filter
    if (activeTab === "anggota" && notif.target !== "anggota") return false;
    if (activeTab === "pengelola" && notif.target !== "pengelola") return false;
    
    // Category filter
    if (categoryFilter !== "semua" && notif.type !== categoryFilter) return false;
    
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleTestSound = () => {
    playNotificationSound();
  };

  const getTypeStyle = (type: "koperasi" | "zakat" | "produk") => {
    switch(type) {
      case "zakat":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-100",
          icon: <Heart size={14} className="text-emerald-700 fill-emerald-150" />,
          label: "Zakat"
        };
      case "koperasi":
        return {
          bg: "bg-amber-50 text-amber-850 border-amber-100/60",
          icon: <Handshake size={14} className="text-amber-700" />,
          label: "Koperasi"
        };
      case "produk":
        return {
          bg: "bg-indigo-50 text-indigo-800 border-indigo-100",
          icon: <Package size={14} className="text-indigo-700" />,
          label: "Produk Kedai"
        };
    }
  };

  return (
    <div className="relative font-sans text-xs">
      {/* Target Bell Trigger button */}
      <button
        id="bell-notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer outline-none active:scale-95 flex items-center justify-center border border-gray-250/20"
        title="Pusat Notifikasi Digital NU"
      >
        <Bell size={18} className={unreadCount > 0 ? "text-emerald-850 animate-pulse" : "text-gray-500"} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-extrabold h-4 px-1.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-out / drop-down panel with backdrops */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-away backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Popover pane */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed sm:absolute top-16 sm:top-auto right-4 sm:right-0 left-4 sm:left-auto mt-2.5 w-auto sm:w-96 bg-white rounded-[24px] border border-gray-105 shadow-2xl z-50 overflow-hidden text-slate-800"
            >
              {/* Header section with tools */}
              <div className="p-4 bg-emerald-900 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none"></div>
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                    <span>Notifikasi Digital MWC</span>
                    <Sparkles size={13} className="text-amber-300 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-emerald-100 font-medium">Layanan real-time muamalah & zakat</p>
                </div>
                
                <div className="flex items-center gap-1.5 z-10">
                  <button
                    onClick={handleTestSound}
                    className="p-1 px-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-[10px] font-extrabold flex items-center gap-1"
                    title="Uji coba nada dering suara"
                  >
                    <Volume2 size={12} />
                    <span>Nada</span>
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-white/10"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Scope Segment switchboard */}
              <div className="p-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab("semua")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      activeTab === "semua" ? "bg-emerald-800 text-white font-extrabold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/40"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setActiveTab("anggota")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      activeTab === "anggota" ? "bg-emerald-850 text-white font-extrabold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/40"
                    }`}
                  >
                    Anggota
                  </button>
                  <button
                    onClick={() => setActiveTab("pengelola")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-0.5 ${
                      activeTab === "pengelola" ? "bg-amber-600 text-emerald-950 font-extrabold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/40"
                    }`}
                  >
                    Pengelola
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { markAllAsRead(); reloadNotifications(); }}
                    className="p-1 text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                    title="Tandai semua lunas terbaca"
                  >
                    <CheckSquare size={13} />
                  </button>
                  <button
                    onClick={() => { clearAllNotificationsTable(); reloadNotifications(); }}
                    className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Bersihkan riwayat terekam"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Categorical Filtering Sub-menu */}
              <div className="px-3.5 py-1.5 border-b border-gray-100 flex gap-1.5 items-center bg-white">
                <span className="text-[9px] font-black uppercase text-gray-400 mr-1.5">Kategori:</span>
                {(["semua", "zakat", "koperasi", "produk"] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded-full text-[9px] capitalize tracking-wide font-black border transition-all ${
                      categoryFilter === cat 
                        ? "bg-slate-100 text-slate-800 border-slate-300"
                        : "bg-transparent text-gray-400 border-transparent hover:border-gray-200 hover:text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Notifications Container */}
              <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100/80 no-scrollbar">
                {filteredNotifs.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 font-bold space-y-1.5">
                    <p className="text-xs">Alhamdulillah, tidak ada notifikasi.</p>
                    <p className="text-[10px] text-gray-400 font-semibold leading-normal">
                      Pemicu: Lakukan pembayaran zakat, belanja barang, atau ajukan pinjaman syariah untuk mendengar nada dering & notifikasi.
                    </p>
                  </div>
                ) : (
                  filteredNotifs.map((notif) => {
                    const style = getTypeStyle(notif.type);
                    return (
                      <div 
                        key={notif.id} 
                        className={`p-3.5 transition-colors flex items-start gap-3 relative ${
                          notif.isRead ? "bg-white" : "bg-emerald-50/20"
                        }`}
                      >
                        {/* Unread circle pip indicator */}
                        {!notif.isRead && (
                          <span className="absolute top-4 left-1.5 w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                        )}

                        {/* Symbolic Type Visual badge */}
                        <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${style.bg}`}>
                          {style.icon}
                        </div>

                        {/* Information card content */}
                        <div className="space-y-1 w-full">
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-extrabold text-gray-900 leading-tight text-[11px]">{notif.title}</span>
                            <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-md border text-slate-500 bg-slate-50">
                              {notif.target === "pengelola" ? "Pengelola" : "Anggota"}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                            {notif.message}
                          </p>

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[9px] font-mono text-gray-400">{notif.timestamp}</span>
                            {!notif.isRead && (
                              <button
                                onClick={() => { markAsRead(notif.id); reloadNotifications(); }}
                                className="text-[9px] font-bold text-emerald-800 hover:underline flex items-center gap-0.5"
                              >
                                <Check size={10} />
                                <span>Tandai Terbaca</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Tray actions Info */}
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-[9px] text-gray-400 font-medium">
                Pondok Aren Smart Notification Center • Chimes Enabled
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating sliding Toasts Stack outside popover, visible globally when triggered */}
      <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[9999] pointer-events-none flex flex-col gap-2.5 max-w-none sm:max-w-sm w-auto sm:w-full font-sans">
        <AnimatePresence>
          {activeToasts.map((toast) => {
            const style = getTypeStyle(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className="pointer-events-auto bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/50 flex gap-3.5 items-start shrink-0"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.bg} border-0`}>
                  {style.icon}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex justify-between items-center gap-2">
                    <h5 className="font-extrabold text-[#fed65b] text-[11.5px]">{toast.title}</h5>
                    <span className="text-[8px] font-black uppercase bg-white/10 px-1.5 py-0.5 rounded text-white tracking-wider">
                      {toast.target === "pengelola" ? "Pengelola" : "Warga"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-205 text-gray-300 leading-normal font-semibold">
                    {toast.message}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
