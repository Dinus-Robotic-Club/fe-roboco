import { ClipboardList, ScrollText, SwordsIcon, UsersRound } from 'lucide-react'
import { NavData } from './types'

const createNav = (data: NavData) => data

export const CTA_BUTTONS = ['Masuk', 'Keluar'] as const

export const nav_home = createNav({
  left: [
    { title: 'Home', href: '/#Home' },
    { title: 'Kategory', href: '/#category' },
    { title: 'Sponsor', href: '/#sponsor' },
  ],
  right: [
    { title: 'Papan liga', href: '/leagueboard' },
    { title: 'Daftar', href: '/register' },
    { title: 'Masuk', href: '/auth/login' },
  ],
})

export const nav_tournament = [
  { label: 'Overview', key: 'overview' },
  { label: 'Participants', key: 'participants' },
  { label: 'Teams', key: 'teams' },
  { label: 'Config', key: 'config' },
  { label: 'Bracket', key: 'bracket' },
  { label: 'Group', key: 'group' },
  { label: 'Match', key: 'match' },
  { label: 'Users', key: 'user' },
]

export const nav_dashboard_main = createNav({
  left: [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Profile', href: '/dashboard?view=team-profile' },
    { title: 'Match', href: '/dashboard/match' },
  ],
  right: [{ title: 'Keluar', href: '/auth/login' }],
})

export const nav_admin = createNav({
  left: [
    { title: 'Turnamen', href: '/admin/dashboard' },
    { title: 'Pertandingan', href: '/admin/refree/match' },
    { title: 'Kehadiran', href: '/admin/pendaf/checking-ticket' },
  ],
  right: [
    { title: 'Tambah Peserta', href: '/admin/pendaf/register-team' },
    { title: 'Papan liga', href: '/leagueboard' },
    { title: 'Keluar', href: '/auth/login' },
  ],
})

// Navbar for REFEREE role - only match management
export const nav_referee = createNav({
  left: [{ title: 'Match', href: '/admin/refree/match' }],
  right: [{ title: 'Keluar', href: '/auth/login' }],
})

// Navbar for PENDAF role - registration and attendance
export const nav_pendaf = createNav({
  left: [
    { title: 'Kehadiran', href: '/admin/pendaf/checking-ticket' },
    { title: 'Peserta', href: '/admin/pendaf/list-participant' },
    { title: 'Tambah Tim', href: '/admin/pendaf/register-team' },
  ],
  right: [{ title: 'Keluar', href: '/auth/login' }],
})

// Helper function to get navbar based on user role
export const getNavByRole = (role?: string | null): NavData => {
  switch (role) {
    case 'REFEREE':
      return nav_referee
    case 'PENDAF':
      return nav_pendaf
    case 'ADMIN':
    default:
      return nav_admin
  }
}

export const nav_participants = createNav({
  left: [
    { title: 'Tournament', href: '#' },
    { title: 'Match', href: '#' },
  ],
  right: [
    { title: 'Bracket', href: '#' },
    { title: 'Standings', href: '#' },
  ],
})

export const nav_legaueboard = [
  { label: 'GROUP RANK - SUMMO', key: 'group-rank-sumo' },
  { label: 'GROUP RANK - SOCCER', key: 'group-rank-soccer' },
  { label: 'BASIS RANK', key: 'basis-rank' },
  { label: 'PLAYOFF - SUMMO', key: 'playoff-sumo' },
  { label: 'PLAYOFF - SOCCER', key: 'playoff-soccer' },
  { label: 'MATCH - ON GOING', key: 'on-going match' },
  { label: 'MATCH HISTORY', key: 'match-history' },
]

export const nav_dashboard = [
  { label: 'TEAM DASHBOARD', key: 'team-dashboard' },
  { label: 'TEAM PROFILE', key: 'team-profile' },
  { label: 'CERTIFICATE', key: 'certificate' },
]

export const categories = [
  {
    id: 'soccerbot',
    title: 'SOCCER BOT',
    description: [
      'Soccer Robot Competition 1 kg adalah pertandingan sepak bola robot di mana dua tim robot berukuran dan berbobot maksimal 1 kg beradu strategi untuk mencetak gol sebanyak mungkin. Peserta harus mengembangkan robot yang mampu menavigasi lapangan, mendeteksi bola, bekerja sama (jika menggunakan lebih dari satu robot per tim), dan mengambil keputusan cepat. Lomba ini menantang kreativitas peserta dalam hal sensor, kontrol, serta algoritma kecerdasan robot.',
    ],
    image: '/notfound-robot.svg',
    icon: '/logo-soccer.svg',
    guidebook: '/document/SOCCER BOT GUIDE BOOK - DN ROBOCO 2026.pdf',
  },
  {
    id: 'sumobot',
    title: 'SUMMO BOT',
    description: [
      'Sumo Robot Competition 1 kg adalah kompetisi adu kekuatan dan strategi antara dua robot otonom maupun remote yang masing-masing memiliki berat maksimum 1 kg. Robot bertarung di atas arena dohyo untuk mendorong lawan keluar dari garis arena. Peserta ditantang merancang robot yang kuat, cepat, stabil, serta responsif terhadap kondisi pertandingan. Kompetisi ini menguji kemampuan desain mekanik, kontrol, dan taktik bertarung robot secara intens dan penuh aksi.',
    ],
    image: '/notfound-robot.svg',
    icon: '/logo-summo.svg',
    guidebook: '/document/SUMMO BOT GUIDE BOOK - DN ROBOCO 2026.pdf',
  },
]

export const TextQna = [
  {
    title: 'Siapa yang boleh mengikuti DN ROBOCO 2026?',
    description: 'Warga Negara Indonesia dari kalangan umum, termasuk pelajar, mahasiswa, dan komunitas robotika.',
  },
  {
    title: 'Berapa jumlah anggota dalam satu tim?',
    description: 'Setiap tim maksimal terdiri dari 2 orang.',
  },
  {
    title: 'Apakah robot disediakan panitia?',
    description: 'Tidak. Peserta harus membawa robot dan perlengkapan masing-masing, termasuk baterai dan alat kerja.',
  },
  {
    title: 'Berapa batas ukuran, berat, dan baterai robot?',
    description: 'Maksimal 15cm x 15cm x 20cm, berat 1 kg, dan baterai maksimal 12.6V.',
  },
  {
    title: 'Apa controller yang boleh digunakan?',
    description: 'Robot dapat dikendalikan menggunakan smartphone, joystick, atau controller sejenis.',
  },
  {
    title: 'Bagaimana format babak grup?',
    description: 'Sistem poin: Menang 3 poin, seri 1 poin, kalah 0. Tiga tim terbaik dari tiap grup maju ke playoff.',
  },
  {
    title: 'Apa saja yang dapat menyebabkan diskualifikasi?',
    description: 'Tidak hadir saat dipanggil, merusak arena, membuat keributan, atau membawa jammer sinyal.',
  },
  {
    title: 'Apakah peraturan bisa berubah?',
    description: 'Ya, peraturan dapat berubah hingga technical meeting dan akan dijelaskan oleh moderator.',
  },
]

export const timeline = [
  {
    title: 'Open Registration',
    description: 'Pendaftaran resmi peserta dibuka, saatnya bergabung dan tunjukkan potensi terbaikmu.',
    date: '1 Desember 2025',
    icon: ScrollText,
  },
  {
    title: 'Close Registration',
    description: 'Penutupan pendaftaran, kesempatan terakhir untuk masuk dalam kompetisi ini.',
    date: '12 Januari 2026',
    icon: ClipboardList,
  },
  {
    title: 'Technical Meeting',
    description: 'Sesi pengarahan teknis bagi seluruh peserta sebelum memasuki arena kompetisi.',
    date: '12 Januari 2026',
    icon: UsersRound,
  },
  {
    title: 'Main Event',
    description: 'Pertandingan utama dimulai, para peserta beradu strategi untuk menjadi yang terbaik.',
    date: '24 Januari 2026',
    icon: SwordsIcon,
  },
]

export const CAPTION_TEXT = `Setiap inovasi adalah pijakan kecil menuju masa depan penuh cahaya. ⚙️✨

Perjalanan baru ini bagaikan para pejuang teknologi yang menapaki tangga menuju langit robotik—langit yang dipenuhi cahaya ide, kreativitas, dan semangat tanpa batas. Kini adalah waktunya bagi kita untuk bersinar lebih terang, melangkah lebih jauh, dan menciptakan pengalaman yang tak terlupakan bersama. 🤖💫

Perkenalkan, saya [Nama Lengkap] dari [Nama Komunitas / Nama Instansi], turut serta memeriahkan DN.Roboco 2026 dalam rangkaian Dinus Fest. Dengan penuh semangat dan harapan, mari kita menapaki “tangga inovasi” ini bersama-sama, menunjukkan bahwa kita mampu berdiri tegak di antara bintang-bintang teknologi masa depan. ✨

Mari kita berkarya, berkompetisi, dan bersinar dalam DN.Roboco 2026.
Let’s innovate higher and shine brighter among the stars of robotics! 💙⚡

“Bergerak Bersama Inovasi, Bersinar Menuju Masa Depan Robotika.”

@dinus_robotic_club
#dinusfest2026 #dnroboco2026 #dnroboco`

export const teams: ITeamBracket[] = [
  { id: '1', name: 'RRQ Hoshi', logoUrl: '/logo-only.svg' }, // index 0
  { id: '2', name: 'ONIC Esports', logoUrl: '/logo-only.svg' }, // index 1
  { id: '3', name: 'EVOS Legends', logoUrl: '/logo-only.svg' }, // index 2
  { id: '4', name: 'Bigetron Alpha', logoUrl: '/logo-only.svg' }, // index 3
  { id: '5', name: 'Alter Ego', logoUrl: '/logo-only.svg' }, // index 4
  { id: '6', name: 'Aura Fire', logoUrl: '/logo-only.svg' }, // index 5
  { id: '7', name: 'Geek Fam', logoUrl: '/logo-only.svg' }, // index 6
  { id: '8', name: 'Rebellion Zion', logoUrl: '/logo-only.svg' }, // index 7
]

export const bracket6Teams: IMatchBracket[] = [
  // ==========================================
  // ROUND 1: PLAY-INS (Pion Baku Hantam)
  // ==========================================
  {
    id: 'PI-M1',
    name: 'Play-in Match 1',
    teams: [teams[2], teams[5]], // Seed 3 vs Seed 6
    score: [0, 0],
    status: 'Scheduled',
    // MENANG: Ketemu Raja 1 (Seed 1) di UB Semis
    nextMatchWinId: 'UB-SEMI-M1',
    nextMatchWinSlotIsB: true, // Masuk slot B (Bawah/Penantang)
    // KALAH: Turun ke LB Round 1
    nextMatchLoseId: 'LB-R1-M1',
    nextMatchLoseSlotIsB: false,
  },
  {
    id: 'PI-M2',
    name: 'Play-in Match 2',
    teams: [teams[3], teams[4]], // Seed 4 vs Seed 5
    score: [0, 0],
    status: 'Scheduled',
    // MENANG: Ketemu Raja 2 (Seed 2) di UB Semis
    nextMatchWinId: 'UB-SEMI-M2',
    nextMatchWinSlotIsB: true, // Masuk slot B (Bawah/Penantang)
    // KALAH: Turun ke LB Round 1
    nextMatchLoseId: 'LB-R1-M1',
    nextMatchLoseSlotIsB: true,
  },

  // ==========================================
  // ROUND 2: UB SEMIFINALS (Raja Menunggu)
  // ==========================================
  {
    id: 'UB-SEMI-M1',
    name: 'UB Semifinal 1',
    // Slot A: Raja 1 (Seed 1)
    // Slot B: Menunggu Pemenang PI-M1
    teams: [teams[0], null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'UB-FINAL',
    nextMatchWinSlotIsB: false,
    nextMatchLoseId: 'LB-FINAL', // Drop ke LB Final (Logika simple 6 tim)
    nextMatchLoseSlotIsB: false,
  },
  {
    id: 'UB-SEMI-M2',
    name: 'UB Semifinal 2',
    // Slot A: Raja 2 (Seed 2)
    // Slot B: Menunggu Pemenang PI-M2
    teams: [teams[1], null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'UB-FINAL',
    nextMatchWinSlotIsB: true,
    nextMatchLoseId: 'LB-FINAL', // Drop ke LB Final
    nextMatchLoseSlotIsB: true,
  },

  // ==========================================
  // LOWER BRACKET (Simplified for 6 Teams)
  // ==========================================
  {
    id: 'LB-R1-M1',
    name: 'LB Semifinal', // Loser PI 1 vs Loser PI 2
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'LB-FINAL', // Pemenang lawan yang kalah di UB Semi
    nextMatchWinSlotIsB: true, // Masuk dari bawah
    nextMatchLoseId: null,
  },
  {
    id: 'LB-FINAL',
    name: 'LB Final',
    // Slot A: Kalah dari UB Semi
    // Slot B: Menang dari LB R1
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'GRAND-FINAL',
    nextMatchWinSlotIsB: true,
    nextMatchLoseId: null,
  },

  // ==========================================
  // GRAND FINAL
  // ==========================================
  {
    id: 'UB-FINAL', // Ini Final UB sebenernya
    name: 'Upper Bracket Final',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'GRAND-FINAL',
    nextMatchWinSlotIsB: false,
    nextMatchLoseId: 'LB-FINAL',
    nextMatchLoseSlotIsB: false,
  },
  {
    id: 'GRAND-FINAL',
    name: 'Grand Final',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: null,
    nextMatchLoseId: null,
  },
]

export const bracket8Teams: IMatchBracket[] = [
  // ==========================================
  // ROUND 1: UPPER BRACKET QUARTER FINALS
  // ==========================================
  {
    id: 'UB-QF-M1',
    name: 'Quarter Final 1',
    teams: [teams[0], teams[7]], // Seed 1 vs 8
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'UB-SEMI-M1',
    nextMatchWinSlotIsB: false,
    nextMatchLoseId: 'LB-R1-M1',
    nextMatchLoseSlotIsB: false,
  },
  {
    id: 'UB-QF-M2',
    name: 'Quarter Final 2',
    teams: [teams[3], teams[4]], // Seed 4 vs 5
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'UB-SEMI-M1',
    nextMatchWinSlotIsB: true,
    nextMatchLoseId: 'LB-R1-M1',
    nextMatchLoseSlotIsB: true,
  },
  {
    id: 'UB-QF-M3',
    name: 'Quarter Final 3',
    teams: [teams[1], teams[6]], // Seed 2 vs 7
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'UB-SEMI-M2',
    nextMatchWinSlotIsB: false,
    nextMatchLoseId: 'LB-R1-M2',
    nextMatchLoseSlotIsB: false,
  },
  {
    id: 'UB-QF-M4',
    name: 'Quarter Final 4',
    teams: [teams[2], teams[5]], // Seed 3 vs 6
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'UB-SEMI-M2',
    nextMatchWinSlotIsB: true,
    nextMatchLoseId: 'LB-R1-M2',
    nextMatchLoseSlotIsB: true,
  },

  // ==========================================
  // ROUND 2: UPPER BRACKET SEMIS
  // ==========================================
  {
    id: 'UB-SEMI-M1',
    name: 'Semi Final 1',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'UB-FINAL',
    nextMatchWinSlotIsB: false,
    nextMatchLoseId: 'LB-R2-M1',
    nextMatchLoseSlotIsB: true, // Cross seed logic usually
  },
  {
    id: 'UB-SEMI-M2',
    name: 'Semi Final 2',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'UB-FINAL',
    nextMatchWinSlotIsB: true,
    nextMatchLoseId: 'LB-R2-M1',
    nextMatchLoseSlotIsB: false,
  },

  // ==========================================
  // ROUND 1: LOWER BRACKET
  // ==========================================
  {
    id: 'LB-R1-M1',
    name: 'LB Round 1 Match 1',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'LB-R2-M1',
    nextMatchWinSlotIsB: false,
    nextMatchLoseId: null,
  },
  {
    id: 'LB-R1-M2',
    name: 'LB Round 1 Match 2',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'LB-R2-M1',
    nextMatchWinSlotIsB: true, // Simplifikasi masuk ke 1 match LB R2
    nextMatchLoseId: null,
  },

  // ==========================================
  // ROUND 2: LOWER BRACKET (Semi Lower)
  // ==========================================
  {
    id: 'LB-R2-M1',
    name: 'LB Semifinal',
    teams: [null, null], // Winner LB R1 vs Loser UB Semi
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'LB-FINAL',
    nextMatchWinSlotIsB: true,
    nextMatchLoseId: null,
  },

  // ==========================================
  // FINALS
  // ==========================================
  {
    id: 'UB-FINAL',
    name: 'Upper Bracket Final',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'GRAND-FINAL',
    nextMatchWinSlotIsB: false,
    nextMatchLoseId: 'LB-FINAL',
    nextMatchLoseSlotIsB: false,
  },
  {
    id: 'LB-FINAL',
    name: 'Lower Bracket Final',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: 'GRAND-FINAL',
    nextMatchWinSlotIsB: true,
    nextMatchLoseId: null,
  },
  {
    id: 'GRAND-FINAL',
    name: 'Grand Final',
    teams: [null, null],
    score: [0, 0],
    status: 'Scheduled',
    nextMatchWinId: null,
    nextMatchLoseId: null,
  },
]
