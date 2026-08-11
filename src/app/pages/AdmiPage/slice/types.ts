export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalIdeas: number;
  publishedIdeas: number;
  draftIdeas: number;
  archivedIdeas: number;
  adminCount: number;
  userCount: number;
  recentActivity: RecentActivity[];
  userGrowthData: GrowthData[];
  ideaGrowthData: GrowthData[];
}

export interface RecentActivity {
  id: string;
  type: "user" | "idea";
  action: "created" | "updated" | "deleted" | "activated" | "deactivated";
  user: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  details?: string;
}

export interface GrowthData {
  date: string;
  count: number;
}

export interface AdminDashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  lastUpdated: string | null;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message?: string;
}
