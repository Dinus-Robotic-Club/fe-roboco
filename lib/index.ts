export const nav_home = {
    left: [
        { title: 'Home', href: '/#Home' },
        { title: 'Tentang', href: '/#about' },
        { title: 'Kategori', href: '/#category' },
    ],
    right: [
        { title: 'Sponsorship', href: '/#sponsor' },
        { title: 'kontak', href: '/#' },
        { title: 'Registrasi', href: '/register' },
    ],
}

export const nav_register = {
    left: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Riwayat', href: '#' },
    ],
    right: [
        { title: 'Leagueboard', href: '#' },
        { title: 'Standings', href: '#' },
    ],
}

export const nav_dashboard_main = {
    left: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Match', href: '/dashboard/match' },
    ],
    right: [
        { title: 'Leagueboard', href: '/dashboard/leagueboard' },
        { title: 'Standings', href: '#' },
    ],
}

export const nav_admin = {
    left: [
        { title: 'Tournament', href: '/admin/dashboard' }, //buat liat list turnamen yang ada
        { title: 'Match', href: '#' }, // nanti bakal masuk ke (/match) buat get all match
    ],
    right: [
        { title: 'Bracket', href: '#' }, //buat liat bracket playoff yang ada (/bracket)
        { title: 'Standings', href: '/leagueboard' }, // buat liat klasemen yang ada (leagueboard)
    ],
}

export const nav_participants = {
    left: [
        { title: 'Tournament', href: '#' },
        { title: 'Match', href: '#' },
    ],
    right: [
        { title: 'Bracket', href: '#' },
        { title: 'Standings', href: '#' },
    ],
}

export const nav_legaueboard = [
    { label: 'GROUP RANK - SUMMO', key: 'group-rank-sumo' },
    { label: 'GROUP RANK - SOCCER', key: 'group-rank-soccer' },
    { label: 'BASIS RANK', key: 'basis-rank' },
    { label: 'PLAYOFF - SUMMO', key: 'playoff-sumo' },
    { label: 'PLAYOFF - SOCCER', key: 'playoff-soccer' },
]

export const nav_dashboard = [
    { label: 'TEAM DASHBOARD', key: 'team-dashboard' },
    { label: 'TEAM PROFILE', key: 'team-profile' },
    { label: 'CERTIFICATE', key: 'certificate' },
]

export const leaderboard_dumy = [
    {
        rank: 1,
        logo: '/logo-only.svg',
        team: 'TEAM Nee Guzz',
        school: "SMKN 7 1 Kota Semarang's Basis",
        stats: { MP: 4, W: 3, D: 4, L: 19, P: 12 },
    },
    {
        rank: 2,
        logo: '/logo-only.svg',
        team: 'Mahasigma',
        school: 'Universitas Digidaw',
        stats: { MP: 4, W: 2, D: 12, L: -10, P: 0 },
    },
    {
        rank: 3,
        logo: '/logo-only.svg',
        team: 'Loyalty Crown',
        school: 'Pambot Team',
        stats: { MP: 4, W: 14, D: 0, L: 14, P: 14 },
    },
    {
        rank: 4,
        logo: '/logo-only.svg',
        team: 'AMBATAKUM',
        school: "SMK N 82 Kota Semarang's Basis",
        stats: { MP: 4, W: 4, D: 1, L: 3, P: 3 },
    },
]

export const groups_dummy = [
    {
        name: 'Group A',
        teams: [
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 15 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
        ],
    },
    {
        name: 'Group B',
        teams: [
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 15 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
        ],
    },
    {
        name: 'Group C',
        teams: [
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 15 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
            {
                team: 'TEAM Nee Guzz',
                school: "SMKN 71 Kota Semarang's Basis",
                logo: '/logo-only.svg',
                stats: { MP: 4, GS: 23, GC: 4, GD: 19, P: 12 },
            },
        ],
    },
]

export const groups_list = [
    {
        logo: '/logo-only.svg',
        name: 'Alpha Strikers',
        email: 'alpha.strikers@example.com',
        category: 'soccer',
        instansi: 'Universitas Teknologi Nusantara',
        present: true,
        status: 'verified',
    },

    {
        logo: '/logo-only.svg',
        name: 'Sumo Guardians',
        email: 'sumo.guardians@example.com',
        category: 'sumo',
        instansi: 'Politeknik Negeri Bandung',
        present: false,
        status: 'pending',
    },
    {
        logo: '/logo-only.svg',
        name: 'Cyber Kickers',
        email: 'cyber.kickers@example.com',
        category: 'soccer',
        instansi: 'Universitas Diponegoro',
        present: true,
        status: 'verified',
    },
    {
        logo: '/logo-only.svg',
        name: 'Iron Sumo Squad',
        email: 'iron.sumo@example.com',
        category: 'sumo',
        instansi: 'Institut Teknologi Sepuluh Nopember',
        present: false,
        status: 'rejected',
    },
    {
        logo: '/logo-only.svg',
        name: 'Blitz United',
        email: 'blitz.united@example.com',
        category: 'soccer',
        instansi: 'Universitas Multimedia Nusantara',
        present: true,
        status: 'verified',
    },
    {
        logo: '/logo-only.svg',
        name: 'Sumo Guardians',
        email: 'sumo.guardians@example.com',
        category: 'sumo',
        instansi: 'Politeknik Negeri Bandung',
        present: false,
        status: 'pending',
    },
    {
        logo: '/logo-only.svg',
        name: 'Cyber Kickers',
        email: 'cyber.kickers@example.com',
        category: 'soccer',
        instansi: 'Universitas Diponegoro',
        present: true,
        status: 'verified',
    },
    {
        logo: '/logo-only.svg',
        name: 'Iron Sumo Squad',
        email: 'iron.sumo@example.com',
        category: 'sumo',
        instansi: 'Institut Teknologi Sepuluh Nopember',
        present: false,
        status: 'rejected',
    },
    {
        logo: '/logo-only.svg',
        name: 'Blitz United',
        email: 'blitz.united@example.com',
        category: 'soccer',
        instansi: 'Universitas Multimedia Nusantara',
        present: true,
        status: 'verified',
    },
    {
        logo: '/logo-only.svg',
        name: 'Blitz United',
        email: 'blitz.united@example.com',
        category: 'soccer',
        instansi: 'Universitas Multimedia Nusantara',
        present: true,
        status: 'verified',
    },
    {
        logo: '/logo-only.svg',
        name: 'Blitz United',
        email: 'blitz.united@example.com',
        category: 'soccer',
        instansi: 'Universitas Multimedia Nusantara',
        present: true,
        status: 'verified',
    },
]

export const member_list = [
    {
        name: 'Joshua Wirawan',
        team: 'Harmonic Seals',
        category: 'soccer',
        role: 'leader',
        phone: '081212345678',
    },
    {
        name: 'Zirly Daffa Husain',
        team: 'The Ballers',
        category: 'soccer',
        role: 'leader',
        phone: '081298765432',
    },
    {
        name: 'Aristides Bima',
        team: 'KupasKuaci.group',
        category: 'sumo',
        role: 'leader',
        phone: '082133445566',
    },
    {
        name: 'Michael Argento',
        team: 'Args Dev',
        category: 'soccer',
        role: 'member',
        phone: '082144556677',
    },
    {
        name: 'Kiagus Resadu',
        team: 'CAPYBRO STUDIO',
        category: 'sumo',
        role: 'leader',
        phone: '081390112233',
    },
    {
        name: 'Aditya Wulan Pratama',
        team: 'Fadia Bekicot',
        category: 'soccer',
        role: 'member',
        phone: '081355667788',
    },
    {
        name: 'Adeptama Denis',
        team: 'Placidusax',
        category: 'sumo',
        role: 'leader',
        phone: '081222334455',
    },
    {
        name: 'Ivan Rafsanjani',
        team: 'Nicotaste',
        category: 'soccer',
        role: 'member',
        phone: '081233445566',
    },
    {
        name: 'Feby Akliji Rofiah',
        team: 'Pixel Pixies 2',
        category: 'sumo',
        role: 'member',
        phone: '082145667799',
    },
    {
        name: 'Mario Prasetyo',
        team: 'Rimata',
        category: 'soccer',
        role: 'leader',
        phone: '081288990011',
    },
    {
        name: 'Mario Prasetyo',
        team: 'Rimata',
        category: 'soccer',
        role: 'leader',
        phone: '081288990011',
    },
]
