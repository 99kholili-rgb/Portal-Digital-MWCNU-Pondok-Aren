import { UserProfile, PrayerTime, NewsItem, KyaiProfile, CoopProduct, FatwaItem, AgendaEvent } from "./types";

export const initialProfile: UserProfile = {
  fullName: "Ahmad Fauzi",
  username: "fauzi_ahmad",
  emailOrPhone: "ahmad@domain.com",
  status: "AKTIF",
  joinedDate: "12 Jan 2021",
  memberType: "Anggota Biasa",
  nia: "31.71.01.2023.00451",
  city: "Jakarta Pusat",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu6acJ-RbECn45HDXQBnQRGDRuPAUTjaXuiK0cMvpyBOsZu4eWn391CrMRkjPY5O1_sa6hd9LQ1hIy43KSW5Tqz1x0n31qT39ONUFyBKKhZsVbCcnLMUmfurLGSDpGadd3rvtIUCQT3Q0mMxEmj-8HmGBSi0o4d3doiUNOzTU4BVZJZ-JRYZa3xme-PlXEcjuiUPGqnZ9Kjy54A49msfAmqxo2Wq3-1XbhbTP9sd9wQ_E-Sf2LQMnKBQXsHvu35-TQox_3PhjAL3UK",
  coopBalance: 4250000,
  dues: [
    {
      monthYear: "Agustus 2023",
      ref: "NU-882910",
      amount: 10000,
      method: "BSI Mobile",
      status: "LUNAS",
    },
    {
      monthYear: "Juli 2023",
      ref: "NU-882745",
      amount: 10000,
      method: "BSI Mobile",
      status: "LUNAS",
    },
    {
      monthYear: "Juni 2023",
      ref: "NU-882512",
      amount: 10000,
      method: "Cash (Lajnah)",
      status: "LUNAS",
    },
  ],
};

export const defaultPrayerSchedule = {
  subuh: "04:32",
  terbit: "05:48",
  dzuhur: "12:04",
  ashar: "15:20",
  maghrib: "18:09",
  isya: "19:21"
};

export const newsCatalog: NewsItem[] = [
  {
    id: "news-1",
    category: "Organisasi",
    title: "PBNU Gelar Muktamar Internasional Fikih Peradaban II",
    timeAgo: "2 jam yang lalu",
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ1CJgmD6p5nQ6t8JqqMW-DWJx7r8XBvOCXJOXnecwdSt7wIWf7LnhwLd8iDPJ9wmzEpn5pxPFbIKzxAVhByjM7jhdY6xgpuALx9qpGs1HJyO87SLUjYuvf0BkLkubM2LWHLuslkHz_77a5RTosc4nedHV-l3s2cRCghdYLuC9xaf71ZaG2ZB3BvhjL-Gc9Aj4ZCFgkI81pkQ0JJg8kJY2SKc14h9dMuq7auEKGiw6FoFsXJNTRv7sFXzBlHSycCyFfrssKl6WFtxO",
  },
  {
    id: "tvnu-1",
    category: "TVNU Pondok Aren",
    title: "[LIVE] Istighosah Kubra & Doa Bersama Keselamatan Bangsa - MWCNU Pondok Aren",
    timeAgo: "1 hari yang lalu",
    imgUrl: "https://img.youtube.com/vi/8mUN9DqX9kQ/mqdefault.jpg",
    youtubeId: "8mUN9DqX9kQ",
    duration: "1:24:15",
  },
  {
    id: "news-2",
    category: "Sosial",
    title: "Update Distribusi Bantuan Kemanusiaan NU Care-LAZISNU",
    timeAgo: "5 jam yang lalu",
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDigb0tCmqMY_iHorwLF4m0a6HjQFp-IpPHhwcI9ARkBJ0mdo9Od-CM4ldmbPdy1GG44nWsG-hrK9nOayV_keFoTw_OUpPoLFnyYhngE1JU-Xu_LNHR-3HmhbvFew1Ji73LM01p7ra1v5YtSsAmf630x4Enl-d7AJrvZfBrRfQfDTp-GFrZzdlemTNu9kLPhnTx-TNzOW_sl6F4rN_95tlp3PL7TJX37AK-Eb51rkN4uJtP7Pt3HuMlb4juOyhXu0n4cUxU4HJCnRle",
  },
  {
    id: "tvnu-2",
    category: "TVNU Pondok Aren",
    title: "Ngaji Fiqih Muamalah Kontemporer Bersama KH. Ahmad Fauzi (Pondok Aren)",
    timeAgo: "3 hari yang lalu",
    imgUrl: "https://img.youtube.com/vi/p7pM-fJqyLM/mqdefault.jpg",
    youtubeId: "p7pM-fJqyLM",
    duration: "34:50",
  },
  {
    id: "news-3",
    category: "Keagamaan",
    title: "Kajian Fiqih Kontemporer: Hukum Fintech Syariah",
    timeAgo: "1 hari yang lalu",
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiNQTJuD-bkc0UYtDEurX_SWDeOP1YCPht0KO26d7Owxpi4wsET-3cBTGQHjzspZaiEkSrUugN3giMBad4Fdiwz2DV54J1HpgH2qnA1kRalaCknIwUq7n_mb0GwThPwN255cwgpjDD5rm8wlyT-OIQ_7mxkV46NZsc_5Z5hPRtx-Kc3BwiH8BTlB5FOoIgIYLwA0iRXdN36bw0y2nClwpyDDfskwCxwLfrR8GsXFSrK80CZog-5iw2b-gGRnEPsCsfu8B51e1CM8pE",
  },
  {
    id: "tvnu-3",
    category: "TVNU Pondok Aren",
    title: "Gema Shalawat & Maulid Akbar Bersama Jam'iyyah Hadrah MWCNU Pondok Aren",
    timeAgo: "5 hari yang lalu",
    imgUrl: "https://img.youtube.com/vi/m4_Z7E2y-0U/mqdefault.jpg",
    youtubeId: "m4_Z7E2y-0U",
    duration: "1:45:20",
  },
  {
    id: "tvnu-4",
    category: "TVNU Pondok Aren",
    title: "Dokumentasi Kirab Pawai & Apel Hari Santri Nasional MWCNU Pondok Aren",
    timeAgo: "1 minggu yang lalu",
    imgUrl: "https://img.youtube.com/vi/gqW-f_C6yvY/mqdefault.jpg",
    youtubeId: "gqW-f_C6yvY",
    duration: "12:10",
  }
];

export const kyaiCatalog: KyaiProfile[] = [
  {
    id: "kyai-1",
    name: "KH. Ahmad Fauzi",
    title: "AHLI FIQIH MUAMALAH",
    rating: 4.9,
    consultations: 120,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaBWmlbFrwldAMVMdZvh_2r1DANSNvYo03l_0dhU7Z6LoNORSfTq3S0W0E-cbhamz3IqS6T0spsr_o-pDw_dkXzehjgcqv0Ucb5BNr0XsNSlFZB7eczzNCjR-BvDAYPmpms3hgmNxGRiwNWEvX7wc0SCpiD3bYgIw_oB7dwmDhXQ_u1uRYYlfhoW1bzRXxM1AXSwqxrlL1cTugsBwOInhoez4_GrwoYfU_rV0cY77YlSHSINKA4LPS3LvGFzvr0ySRa55jV2gvQQa0",
    description: "Pengasuh Pondok Pesantren Al-Hidayah, berpengalaman lebih dari 20 tahun dalam hukum ekonomi syariah, fiqih perkantoran, dan hisab/rukyat.",
    category: "Muamalah",
  },
  {
    id: "kyai-2",
    name: "Nyai Hj. Siti Aminah",
    title: "KONSULTASI KELUARGA",
    rating: 4.8,
    consultations: 85,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJuZTtResjIAjBsh_LHOkwCX0Z12ZI_NhW4FVY63Iha5YXSGhJrTGSjrH4I_dOafApUWzko7JWM8-q6vuXCmBaKs6yPlUnJCHK0GnSkeuuXAXvfyJ7SrhBX39ouXDeWSPtZozNO-Gg5njC6YdRN4Ji_Rb-fvLDr4jAdQeWVyu5U5HueakEzQcdMetX5uuFsV9vasGA4ffFyEUXCfDuH32TdAqJLevm_UpZ1ti29SADDqen0dkvUN3TiulxDJwHe_Ho7IrkncRD_rqT",
    description: "Pakar psikologi keluarga Islami, bimbingan pranikah berdasarkan kitab klasik seperti Uqud al-Lujjayn, dan resolusi konflik rumah tangga.",
    category: "Keluarga",
  },
  {
    id: "kyai-3",
    name: "KH. Syarif Hidayatullah",
    title: "DEWAN BAHTSUL MASAIL",
    rating: 4.9,
    consultations: 210,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaS-Snh8pnTr7VQ3yEASKOvDcFUC7wL1x4tfEoZj3yDBdpUUEzhEicKr5jmVe_i0epcvCiyB_bZuaHfp9qlCJxBLUCaGYdfz-We5UDn6NjmrM1X46COQWFTEL58pXAhmWBjrSoVxs_ndfGdvauvht9FQPgFgiBghczdWPVSmPUtGAC5P-Q0jN2hMx1YkK80SzBHWs4mUVy1hVPPM8Lg5AMbebA5FL-Q_IiJZEsrYe0v642F0s2srWRIzk_1qFiJnOUnY3Xluj7LvPL",
    description: "Spesialis Fiqih Ibadah murni, hukum ibadah kontemporer, penentuan masuknya waktu puasa dan hari raya, serta fatwa amaliyah harian.",
    category: "Ibadah",
  }
];

export const coopProducts: CoopProduct[] = [
  {
    id: "prod-1",
    name: "Beras NU 5kg",
    price: 72500,
    label: "Produk NU",
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-VW6uOGEdXxxWF5OCKPDSXz8j0svDjydpCh_OcNnwCqFEHQ6e-m0IdQWMHW3zF_gMD5j3V_2ioPvCCReKhOSQ5IIjA9I1W8XZxPAS1lgggw5MQq2V-UOzeBuczWF5iYv0WvBcHzDQhAt1_ye6uC__k1dnOYCvBNLxt42pliXKPsVdSJBIbSWeU6i2bZvGkPuNo7ZrPANAU65aHgMvmdLmDEvxJ0i7lV8uUT_3QHUjc4gJDGT39wxFLG_cL2mlXxP087T7mth8RRDJ",
    description: "Beras premium murni kualitas tinggi dari petani binaan Lajnah Pertanian Nahdlatul Ulama, pulen dan berkah.",
  },
  {
    id: "prod-2",
    name: "Kopi Santri Robusta",
    price: 35000,
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1BEeO-JzTxbrbDZTefl7fGM4TNHz-SW2uwWjcHRxrPJOWGOQDNBD3EbimPnimr5GCgT9PYX5CHNkzLVebH-eyInIF5POVXRrICSypbIQNTF2ENB6jQjV9GbOQ0AVjys6UaR_JvaiyeFiuXQqewmKgv7ZWhXrcmPbIarGgLadj8TrPp8lkU2NI6KvNDcjaXSVCDADO6aBYkq1Xh_C4tAqmUac1RgqT8S0X7TsB6fXx-6hRjPdgKjMivA7wJC8kjOf7MwFUs89tely6",
    description: "Biji kopi robusta pilihan yang disangrai secara tradisional oleh santri pondok pesantren, menghasilkan rasa mantap yang khas.",
  },
  {
    id: "prod-3",
    name: "Peci NU Eksklusif",
    price: 85000,
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjAc90SJnN-aFlITQoiT-jfaTY2VZLKBtJQKsdYBAJrwKP1DmoaCxkI3MiL0FAqw5i9nFAs7IdkcKXcMEVUm-CbZv78sCZ5QoEp0jexNyjD6QIlDkQ5kRkvCpMp06gTUE4gJgrAgxL0l1eIMTYNRmH54hQ92wU2uW4Mum211EGu7doFJZQ4gjSHLk9sxGSqHsJUAgN5cbKQmI5eM99Hi2bVtZXoeBuc0_V9L8ELF6t8EKB186oqMJ_if5jeT_k6zSF-oC6c0jb5GM6",
    description: "Peci beludru berkualitas tinggi dengan bordir logo Nahdlatul Ulama berwarna emas. Nyaman dipakai ibadah dan kegiatan formal.",
  }
];

export const fatwaCatalog: FatwaItem[] = [
  {
    id: "fatwa-1",
    title: "Hukum Penggunaan AI dalam Ibadah Virtual",
    category: "Ibadah",
    status: "Tuntas",
    date: "12 Okt 2023",
    source: "Keputusan Bahtsul Masail",
  },
  {
    id: "fatwa-2",
    title: "Zakat Profesi dari Hasil Content Creator",
    category: "Muamalah",
    status: "Draft",
    date: "08 Okt 2023",
    source: "Musyawarah Nasional",
  },
  {
    id: "fatwa-3",
    title: "Etika Berinteraksi di Media Sosial",
    category: "Muamalah",
    status: "Tuntas",
    date: "01 Okt 2023",
    source: "Keputusan Bahtsul Masail",
  },
  {
    id: "fatwa-4",
    title: "Hukum Pembagian Harta Waris Melintasi Perbedaan Agama",
    category: "Munakahat",
    status: "Tuntas",
    date: "15 Sep 2023",
    source: "Keputusan Bahtsul Masail",
  }
];

export const agendaCatalog: AgendaEvent[] = [
  {
    id: "ev-1",
    title: "Muktamar Nasional NU",
    day: "25",
    month: "Okt",
    time: "25 - 27 Okt",
    location: "Surabaya",
    type: "UTAMA",
    description: "Musyawarah tertinggi ulama Nahdlatul Ulama untuk merumuskan kemandirian umat dan arah peradaban Islam Nusantara.",
  },
  {
    id: "ev-2",
    title: "Bahtsul Masail Wilayah",
    day: "04",
    month: "Nov",
    time: "08:30 - Selesai",
    location: "Gedung PWNU Jawa Timur",
    type: "REGULER",
    description: "Kajian hukum fiqih kontemporer membahas problematika umat terbaru yang dihadapi di era modern.",
  },
  {
    id: "ev-3",
    title: "Seminar Ekonomi Syariah",
    day: "12",
    month: "Nov",
    time: "13:00 - 15:30 WIB",
    location: "Aula KH Hasyim Asy'ari",
    type: "REGULER",
    description: "Bedah tuntas potensi dan ekosistem keuangan syariah digital bursa komoditas dan koperasi syariah.",
  },
  {
    id: "ev-4",
    title: "Pesta Rakyat & Bazar UMKM",
    day: "01",
    month: "Des",
    time: "Sepanjang Hari",
    location: "Lap. Panahan Senayan",
    type: "REGULER",
    description: "Bazar akbar produk-produk UMKM warga Nahdliyin, panggung seni kebudayaan, dan pengundian hadiah kartu anggota.",
  }
];
