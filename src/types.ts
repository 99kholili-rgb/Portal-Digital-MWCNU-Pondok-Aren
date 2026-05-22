export interface DuesRecord {
  monthYear: string;
  ref: string;
  amount: number;
  method: string;
  status: "LUNAS" | "BELUM LUNAS";
}

export interface UserProfile {
  fullName: string;
  username?: string;
  emailOrPhone: string;
  password?: string;
  memberId?: string; // Optional Kartanu ID
  status: "AKTIF" | "TIDAK AKTIF";
  joinedDate: string;
  memberType: string;
  nia: string;
  city: string;
  avatarUrl: string;
  dues: DuesRecord[];
  coopBalance: number;
}

export interface PrayerTime {
  name: string;
  time: string;
  active: boolean;
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  timeAgo: string;
  imgUrl: string;
  youtubeId?: string;
  duration?: string;
}

export interface KyaiProfile {
  id: string;
  name: string;
  title: string;
  rating: number;
  consultations: number;
  image: string;
  description: string;
  category: "Ibadah" | "Muamalah" | "Keluarga" | "Akidah";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "kyai";
  text: string;
  timestamp: string;
}

export interface CoopProduct {
  id: string;
  name: string;
  price: number;
  label?: string;
  imgUrl: string;
  description: string;
}

export interface FatwaItem {
  id: string;
  title: string;
  category: "Ibadah" | "Muamalah" | "Munakahat";
  status: "Tuntas" | "Draft";
  date: string;
  source: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  day: string;
  month: string;
  time: string;
  location: string;
  type: "UTAMA" | "REGULER";
  description: string;
}

export interface LoanApplication {
  id: string;
  fullName: string;
  nia: string;
  address: string;
  phone: string;
  job: string;
  businessType: string;
  amount: number;
  purpose: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  submittedAt: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "koperasi" | "zakat" | "produk";
  target: "anggota" | "pengelola";
  isRead: boolean;
  meta?: {
    userName?: string;
    amount?: number;
    referenceId?: string;
    status?: string;
  };
}


