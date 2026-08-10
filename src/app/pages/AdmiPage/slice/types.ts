export interface AdminStats {
  totalUsers: number;
  totalIdeas: number;
  pendingIdeas: number;
  approvedIdeas: number;
  rejectedIdeas: number;
}

export interface AdminState {
  stats: AdminStats;
  loading: boolean;
  error: string | null;
}
