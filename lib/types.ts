export interface NavItem {
  title: string;
  href: string;
}

export interface NavData {
  left: NavItem[];
  right: NavItem[];
}

export interface FormDataTeam {
  team_name: string;
  team_logo: File | null;
  kategori: string;
  asal_instansi: string;
}

export interface FormDataPlayer {
  player1_name: string;
  player1_picture: File | null;
  player1_twibbon: string;
  player1_phone: string;
  player2_name: string;
  player2_picture: File | null;
  player2_twibbon: string;
  player2_phone: string;
}
