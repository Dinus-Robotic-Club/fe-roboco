export interface IBodyRegisterTeam {
  team: ITeamBody;
  participants: IParticipantsBody[];
}

interface IParticipantsBody {
  participantsName: string;
  participantsRoleInTeam: string;
  participantsImage: File | null;
  participantsIdentityCardImage: File | null;
  participantsTwibbon: string;
  participantsPhone: string;
}

interface IUser {
  uid?: string;
  email?: string;
  name?: string;
}

interface ITeamBody {
  name: string;
  communityName: string;
  password: string;
  confirmPassword?: string;
  category: string;
  invoice: File | null;
  email: string;
  logo: File | null;
  tournamentId: string;
}

type TeamError = {
  [K in keyof ITeamBody]?: string;
};

type ParticipantError = {
  [K in keyof IParticipantsBody]?: string;
};

export type RegisterError = {
  team: Partial<Record<keyof ITeamBody, string>>;
  participants: Partial<Record<keyof IParticipantsBody, string>>[];
};

interface ILoginError {
  email?: string;
  password?: string;
  general?: string;
}

export interface DashboardTeamResponse {
  success: boolean;
  status: number;
  message: string;
  data: DashboardTeamData;
}

export interface DashboardTeamData {
  team: Team;
  communityStanding: CommunityStanding;
  groupStanding: GroupStanding;
  stats: TeamStats;
  matchHistory: IMatchHistory[];
}

// Type untuk Score
interface IScore {
  golScore: number;
  knockout: boolean;
}

// Type untuk Community (Karena kamu select: true, semua field keambil)
// --- ENUMS ---
// Sesuaikan dengan Prisma Enum kamu
export type MatchEventType = "GOAL" | "OWN_GOAL" | "YELLOW_CARD" | "RED_CARD" | "PENALTY" | "FOUL" | "KNOCKOUT";

// --- SUB INTERFACES ---

export interface ICommunity {
  uid: string;
  name: string;
  logo?: string | null;
}

export interface IScore {
  golScore: number;
  knockout?: number | boolean; // Bisa number (0/1) atau boolean tergantung handling di FE
}

export interface IPlayer {
  name: string;
}

// Type untuk Event/Log (Timeline)
export interface IMatchEvent {
  id: string;
  type: MatchEventType;
  value: number;
  minute: number;
  teamId: string;
  player?: IPlayer | null; // Relasi ke player (bisa null jika own goal atau data lama)
}

// Type untuk Team di dalam Match
export interface IMatchTeam {
  name: string;
  logo: string | null;
  community: ICommunity | null;
  score: IScore[] | null; // Array karena relasi one-to-many di Prisma
}

// --- TYPE UTAMA (MATCH HISTORY) ---
export interface IMatchHistory {
  // Basic Info
  uid: string; // atau 'id' sesuai schema baru
  createdAt: Date | string;
  category: string; // e.g., 'SOCCER', 'SUMO'

  // IDs (PENTING untuk logika filtering stats di Frontend)
  teamAId: string;
  teamBId: string;

  // Relations
  teamA: IMatchTeam;
  teamB: IMatchTeam;

  // Timeline Events (Wajib ada untuk fitur detail timeline)
  events?: IMatchEvent[];
}

export interface Team {
  uid: string;
  name: string;
  email: string;
  logo: string | null;
  category: string;
  userId: string;
  communityId: string | null;
  createdAt: string;
  updatedAt: string;
  community: Community | null;
  groupTeams: GroupTeam[];
  participants: Participant[];
}

export interface Participant {
  uid: string;
  name: string;
  teamId: string;
  image: string;
  identityCardImage: string;
  phone: string;
  twibbon: string;
  roleInTeam: "LEADER" | "MEMBER"; // bisa ditambah kalau ada role lain
  createdAt: string;
  updatedAt: string;
}

export interface Community {
  uid: string;
  name: string;
  comPoint: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupTeam {
  uid?: string;
  teamId?: string;
  groupId?: string;
  point?: number;
  golDifferent?: number;
  golScore?: number;
  createdAt?: string;
  updatedAt?: string;
  // tambah jika perlu tergantung struktur aslimu
}

export interface CommunityStanding {
  rank: number | null;
  totalCommunity: number;
}

export interface GroupStanding {
  groupRank: number | null;
  groupStandings: GroupStandingEntry[] | null;
}

export interface GroupStandingEntry {
  teamId: string;
  name: string;
  point: number;
  golDiff: number;
  golScore: number;
  rank: number;
}

type updateTeam = Partial<ITeamBody>;
type updateParticipant = Partial<Omit<IParticipantsBody, "participantsIdentityImage">>;

export interface TeamStats {
  totalGolScore: number;
  totalGolConceded: number;
  matchWins: number;
  matchLoses: number;
}

export interface IParticipant {
  uid: string;
  name: string;
  roleInTeam: "LEADER" | "MEMBER";
  image: string;
  twibbon: string;
  phone: string;
}

export interface IRegistration {
  uid: string;
  qrUrl: string | null;
}

export interface ITeamDetail {
  uid: string;
  email: string;
  name: string;
  logo: string;
  community: string;
  category: string;
  participants: IParticipant[];
  registrations: IRegistration[];
}

export interface TeamBracket {
  id: string;
  name: string;
  logoUrl?: string;
  isWinner?: boolean;
}

export interface MatchBracket {
  id: string;
  name: string;
  teams: [TeamBracket, TeamBracket];
  status: "Scheduled" | "Live" | "Completed";
  score?: [number, number];
}
