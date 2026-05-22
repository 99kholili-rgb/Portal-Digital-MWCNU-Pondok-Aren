import { AppNotification } from "../types";

/**
 * Play a beautiful, dual-tone spiritual/positive chime synthesized with Web Audio API.
 * This guarantees a high-fidelity, high-contrast feedback sound without external audio files.
 */
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Play dual harmonized chord tones
    // Tone 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    // Tone 2: A5 (880.00 Hz) - Brighter top sound played 80ms later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880.00, now + 0.08);
    gain2.gain.setValueAtTime(0, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    // Start oscillators
    osc1.start(now);
    osc1.stop(now + 0.6);
    
    osc2.start(now + 0.08);
    osc2.stop(now + 0.8);
  } catch (error) {
    console.warn("Could not play synthesized chime, audio context may be blocked:", error);
  }
}

/**
 * Fetch all notifications from local storage
 */
export function getNotifications(): AppNotification[] {
  try {
    const saved = localStorage.getItem("nu_notifications");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Save notifications list to local storage
 */
export function saveNotifications(notifications: AppNotification[]) {
  localStorage.setItem("nu_notifications", JSON.stringify(notifications));
}

/**
 * Create a new notification, save to localStorage, play sound, and dispatch custom event.
 */
export function addNotification(params: {
  title: string;
  message: string;
  type: "koperasi" | "zakat" | "produk";
  target: "anggota" | "pengelola";
  meta?: AppNotification["meta"];
}): AppNotification {
  const notifications = getNotifications();
  
  // Format current indonesian time for display
  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  const formattedTime = `${now.getDate()} ${months[now.getMonth()]} 2026, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

  const newNotification: AppNotification = {
    id: `NT-${Math.floor(100000 + Math.random() * 900000)}`,
    title: params.title,
    message: params.message,
    timestamp: formattedTime,
    type: params.type,
    target: params.target,
    isRead: false,
    meta: params.meta
  };
  
  const updated = [newNotification, ...notifications].slice(0, 100); // Caps at 100 notifications
  saveNotifications(updated);
  
  // Play sound right away!
  playNotificationSound();
  
  // Dispatch custom window event so any components can instantly update states
  window.dispatchEvent(new CustomEvent("nu_notification_received", { detail: newNotification }));
  
  return newNotification;
}

/**
 * Mark a single notification as read
 */
export function markAsRead(id: string) {
  const notifications = getNotifications();
  const updated = notifications.map(notif => notif.id === id ? { ...notif, isRead: true } : notif);
  saveNotifications(updated);
  window.dispatchEvent(new CustomEvent("nu_notification_received"));
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead() {
  const notifications = getNotifications();
  const updated = notifications.map(notif => ({ ...notif, isRead: true }));
  saveNotifications(updated);
  window.dispatchEvent(new CustomEvent("nu_notification_received"));
}

/**
 * Clear all notifications
 */
export function clearAllNotificationsTable() {
  saveNotifications([]);
  window.dispatchEvent(new CustomEvent("nu_notification_received"));
}
