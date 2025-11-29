import { Calendar, ClipboardList, PartyPopper, ScrollText, SwordsIcon, UsersRound } from "lucide-react";

export const nav_home = {
  left: [
    { title: "Home", href: "/#Home" },
    { title: "Categori", href: "/#category" },
    { title: "Sponsorship", href: "/#sponsor" },
  ],
  right: [
    { title: "Leagueboard", href: "/leagueboard" },
    { title: "Register", href: "/register" },
    { title: "Login", href: "/auth/login" },
  ],
};

export const nav_register = {
  left: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Riwayat", href: "#" },
  ],
  right: [
    { title: "Leagueboard", href: "#" },
    { title: "Standings", href: "#" },
  ],
};

export const nav_dashboard_main = {
  left: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Match", href: "/dashboard/match" },
  ],
  right: [
    { title: "Leagueboard", href: "/leagueboard" },
    { title: "Logout", href: "/logout" },
  ],
};

export const nav_admin = {
  left: [
    { title: "Tournament", href: "/admin/dashboard" }, //buat liat list turnamen yang ada
    { title: "Match", href: "#" }, // nanti bakal masuk ke (/match) buat get all match
  ],
  right: [
    { title: "Bracket", href: "#" }, //buat liat bracket playoff yang ada (/bracket)
    { title: "Standings", href: "/leagueboard" }, // buat liat klasemen yang ada (leagueboard)
  ],
};

export const nav_participants = {
  left: [
    { title: "Tournament", href: "#" },
    { title: "Match", href: "#" },
  ],
  right: [
    { title: "Bracket", href: "#" },
    { title: "Standings", href: "#" },
  ],
};

export const nav_legaueboard = [
  { label: "GROUP RANK - SUMMO", key: "group-rank-sumo" },
  { label: "GROUP RANK - SOCCER", key: "group-rank-soccer" },
  { label: "BASIS RANK", key: "basis-rank" },
  { label: "PLAYOFF - SUMMO", key: "playoff-sumo" },
  { label: "PLAYOFF - SOCCER", key: "playoff-soccer" },
];

export const nav_dashboard = [
  { label: "TEAM DASHBOARD", key: "team-dashboard" },
  { label: "TEAM PROFILE", key: "team-profile" },
  { label: "CERTIFICATE", key: "certificate" },
];

export const leaderboard_dumy = [
  {
    rank: 1,
    logo: "/logo-only.svg",
    team: "TEAM Nee Guzz",
    school: "SMKN 7 1 Kota Semarang's Basis",
    stats: { MP: 4, W: 3, D: 4, L: 19, P: 12 },
  },
  {
    rank: 2,
    logo: "/logo-only.svg",
    team: "Mahasigma",
    school: "Universitas Digidaw",
    stats: { MP: 4, W: 2, D: 12, L: -10, P: 0 },
  },
  {
    rank: 3,
    logo: "/logo-only.svg",
    team: "Loyalty Crown",
    school: "Pambot Team",
    stats: { MP: 4, W: 14, D: 0, L: 14, P: 14 },
  },
  {
    rank: 4,
    logo: "/logo-only.svg",
    team: "AMBATAKUM",
    school: "SMK N 82 Kota Semarang's Basis",
    stats: { MP: 4, W: 4, D: 1, L: 3, P: 3 },
  },
];

export const groups_dummy = [
  {
    name: "Group A",
    teams: [
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 15 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
    ],
  },
  {
    name: "Group B",
    teams: [
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 15 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
    ],
  },
  {
    name: "Group C",
    teams: [
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 15 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
      {
        team: "TEAM Nee Guzz",
        school: "SMKN 71 Kota Semarang's Basis",
        logo: "/logo-only.svg",
        stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
      },
    ],
  },
];

export const groups_list = [
  {
    logo: "/logo-only.svg",
    name: "Alpha Strikers",
    email: "alpha.strikers@example.com",
    category: "soccer",
    instansi: "Universitas Teknologi Nusantara",
    present: true,
    status: "verified",
  },

  {
    logo: "/logo-only.svg",
    name: "Sumo Guardians",
    email: "sumo.guardians@example.com",
    category: "sumo",
    instansi: "Politeknik Negeri Bandung",
    present: false,
    status: "pending",
  },
  {
    logo: "/logo-only.svg",
    name: "Cyber Kickers",
    email: "cyber.kickers@example.com",
    category: "soccer",
    instansi: "Universitas Diponegoro",
    present: true,
    status: "verified",
  },
  {
    logo: "/logo-only.svg",
    name: "Iron Sumo Squad",
    email: "iron.sumo@example.com",
    category: "sumo",
    instansi: "Institut Teknologi Sepuluh Nopember",
    present: false,
    status: "rejected",
  },
  {
    logo: "/logo-only.svg",
    name: "Blitz United",
    email: "blitz.united@example.com",
    category: "soccer",
    instansi: "Universitas Multimedia Nusantara",
    present: true,
    status: "verified",
  },
  {
    logo: "/logo-only.svg",
    name: "Sumo Guardians",
    email: "sumo.guardians@example.com",
    category: "sumo",
    instansi: "Politeknik Negeri Bandung",
    present: false,
    status: "pending",
  },
  {
    logo: "/logo-only.svg",
    name: "Cyber Kickers",
    email: "cyber.kickers@example.com",
    category: "soccer",
    instansi: "Universitas Diponegoro",
    present: true,
    status: "verified",
  },
  {
    logo: "/logo-only.svg",
    name: "Iron Sumo Squad",
    email: "iron.sumo@example.com",
    category: "sumo",
    instansi: "Institut Teknologi Sepuluh Nopember",
    present: false,
    status: "rejected",
  },
  {
    logo: "/logo-only.svg",
    name: "Blitz United",
    email: "blitz.united@example.com",
    category: "soccer",
    instansi: "Universitas Multimedia Nusantara",
    present: true,
    status: "verified",
  },
  {
    logo: "/logo-only.svg",
    name: "Blitz United",
    email: "blitz.united@example.com",
    category: "soccer",
    instansi: "Universitas Multimedia Nusantara",
    present: true,
    status: "verified",
  },
  {
    logo: "/logo-only.svg",
    name: "Blitz United",
    email: "blitz.united@example.com",
    category: "soccer",
    instansi: "Universitas Multimedia Nusantara",
    present: true,
    status: "verified",
  },
];

export const member_list = [
  {
    name: "Joshua Wirawan",
    team: "Harmonic Seals",
    category: "soccer",
    role: "leader",
    phone: "081212345678",
  },
  {
    name: "Zirly Daffa Husain",
    team: "The Ballers",
    category: "soccer",
    role: "leader",
    phone: "081298765432",
  },
  {
    name: "Aristides Bima",
    team: "KupasKuaci.group",
    category: "sumo",
    role: "leader",
    phone: "082133445566",
  },
  {
    name: "Michael Argento",
    team: "Args Dev",
    category: "soccer",
    role: "member",
    phone: "082144556677",
  },
  {
    name: "Kiagus Resadu",
    team: "CAPYBRO STUDIO",
    category: "sumo",
    role: "leader",
    phone: "081390112233",
  },
  {
    name: "Aditya Wulan Pratama",
    team: "Fadia Bekicot",
    category: "soccer",
    role: "member",
    phone: "081355667788",
  },
  {
    name: "Adeptama Denis",
    team: "Placidusax",
    category: "sumo",
    role: "leader",
    phone: "081222334455",
  },
  {
    name: "Ivan Rafsanjani",
    team: "Nicotaste",
    category: "soccer",
    role: "member",
    phone: "081233445566",
  },
  {
    name: "Feby Akliji Rofiah",
    team: "Pixel Pixies 2",
    category: "sumo",
    role: "member",
    phone: "082145667799",
  },
  {
    name: "Mario Prasetyo",
    team: "Rimata",
    category: "soccer",
    role: "leader",
    phone: "081288990011",
  },
  {
    name: "Mario Prasetyo",
    team: "Rimata",
    category: "soccer",
    role: "leader",
    phone: "081288990011",
  },
];

export const categories = [
  {
    id: "soccerbot",
    title: "SOCCER BOT",
    description: [
      "Poster Digital adalah karya visual yang dibuat menggunakan perangkat lunak (software) untuk menyampaikan pesan atau informasi secara singkat, jelas dan menarik.",
      "Poster memanfaatkan elemen visual seperti gambar, ilustrasi, grafik, dan tipografi. Mengutamakan kekuatan visual seperti elemen gambar, warna dan desain untuk menyampaikan pesan secara cepat dan menarik tanpa bergantung pada banyak teks.",
    ],
    image: "/notfound-robot.svg",
    icon: "/logo-soccer.svg",
    guidebook: "/document/SOCCER BOT GUIDE BOOK - DN ROBOCO 2026.pdf",
  },
  {
    id: "sumobot",
    title: "SUMMO BOT",
    description: [
      "Web design merujuk pada perancangan tampilan antarmuka sebuah website, khususnya bagian front-end, yang mencakup tata letak, warna, tipografi, dan elemen visual lainnya agar menarik dan mudah digunakan.",
      "Peserta akan merancang website statis atau front-end website yang menarik dan fungsional dengan mengeksplorasi ide-ide kreatif dan inovatif dalam menyelesaikan permasalahan yang ada di lingkungan sekitar.",
    ],
    image: "/notfound-robot.svg",
    icon: "/logo-summo.svg",
    guidebook: "/document/SUMMO BOT GUIDE BOOK - DN ROBOCO 2026.pdf",
  },
];

export const TextQna = [
  {
    title: "Siapa yang boleh mengikuti DN ROBOCO 2026?",
    description: "Warga Negara Indonesia dari kalangan umum, termasuk pelajar, mahasiswa, dan komunitas robotika.",
  },
  {
    title: "Berapa jumlah anggota dalam satu tim?",
    description: "Setiap tim maksimal terdiri dari 2 orang.",
  },
  {
    title: "Apakah robot disediakan panitia?",
    description: "Tidak. Peserta harus membawa robot dan perlengkapan masing-masing, termasuk baterai dan alat kerja.",
  },
  {
    title: "Berapa batas ukuran, berat, dan baterai robot?",
    description: "Maksimal 15cm x 15cm x 20cm, berat 1 kg, dan baterai maksimal 12.6V.",
  },
  {
    title: "Apa controller yang boleh digunakan?",
    description: "Robot dapat dikendalikan menggunakan smartphone, joystick, atau controller sejenis.",
  },
  {
    title: "Bagaimana format babak grup?",
    description: "Sistem poin: Menang 3 poin, seri 1 poin, kalah 0. Tiga tim terbaik dari tiap grup maju ke playoff.",
  },
  {
    title: "Apa saja yang dapat menyebabkan diskualifikasi?",
    description: "Tidak hadir saat dipanggil, merusak arena, membuat keributan, atau membawa jammer sinyal.",
  },
  {
    title: "Apakah peraturan bisa berubah?",
    description: "Ya, peraturan dapat berubah hingga technical meeting dan akan dijelaskan oleh moderator.",
  },
];

export const timeline = [
  {
    title: "Open Registration",
    description: "Pendaftaran resmi peserta dibuka, saatnya bergabung dan tunjukkan potensi terbaikmu.",
    date: "1 Desember 2025",
    icon: ScrollText,
  },
  {
    title: "Close Registration",
    description: "Penutupan pendaftaran, kesempatan terakhir untuk masuk dalam kompetisi ini.",
    date: "8 Januari 2026",
    icon: ClipboardList,
  },
  {
    title: "Technical Meeting",
    description: "Sesi pengarahan teknis bagi seluruh peserta sebelum memasuki arena kompetisi.",
    date: "10 Januari 2026",
    icon: UsersRound,
  },
  {
    title: "Main Event",
    description: "Pertandingan utama dimulai, para peserta beradu strategi untuk menjadi yang terbaik.",
    date: "20 Januari 2026",
    icon: SwordsIcon,
  },
];
