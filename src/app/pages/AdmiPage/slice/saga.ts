import { call, put, takeLatest, select, all } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../../../Config/services/auth.service";
import { ideaService } from "../../../Config/services/idea.service";
import {
  getDashboardStatsRequest,
  getDashboardStatsSuccess,
  getDashboardStatsFailure,
  refreshDashboardRequest,
  refreshDashboardSuccess,
  refreshDashboardFailure,
} from "./slice";
import type { DashboardStats } from "./slice";
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  toggleUserStatusRequest,
  toggleUserStatusSuccess,
  toggleUserStatusFailure,
} from "./userManagementSlice";
import {
  fetchIdeasRequest,
  fetchIdeasSuccess,
  fetchIdeasFailure,
  updateIdeaStatusRequest,
  updateIdeaStatusSuccess,
  updateIdeaStatusFailure,
  deleteIdeaRequest,
  deleteIdeaSuccess,
  deleteIdeaFailure,
} from "./ideaManagementSlice";
import { selectUser } from "../../authPage/slice/selector";
import type { User } from "../../../types/auth.types";
import type { UpdateUserData } from "../../../types/user.types";

// Types for API responses
interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}

interface IdeasResponse {
  success: boolean;
  data: {
    ideas: any[];
    pagination: {
      page: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}

interface StatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    users: number;
  };
}

// Helper function types
interface RecentActivity {
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

interface GrowthData {
  date: string;
  count: number;
}

function* handleGetDashboardStats(): SagaIterator {
  try {
    // Get user to check if admin
    const user: User = yield select(selectUser);

    if (!user || user.role !== "admin") {
      yield put(
        getDashboardStatsFailure("Unauthorized: Admin access required"),
      );
      return;
    }

    const [usersResponse, ideasResponse, statsResponse]: [
      UsersResponse,
      IdeasResponse,
      StatsResponse,
    ] = yield call(Promise.all, [
      authService.allUsers({ page: 1, limit: 1000 }),
      ideaService.getAllIdeas({ page: 1, limit: 1000 }),
      authService.userStats(),
    ]);

    // Process users data
    const users = usersResponse.data?.users || [];
    const totalUsers = users.length;
    const activeUsers = users.filter((u: User) => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    const adminCount = users.filter((u: User) => u.role === "admin").length;
    const userCount = users.filter((u: User) => u.role === "user").length;

    const ideas = ideasResponse.data?.ideas || [];
    const totalIdeas = ideas.length;
    const publishedIdeas = ideas.filter(
      (i: any) => i.status === "published",
    ).length;
    const draftIdeas = ideas.filter((i: any) => i.status === "draft").length;
    const archivedIdeas = ideas.filter(
      (i: any) => i.status === "archived",
    ).length;

    const recentActivity: RecentActivity[] = generateRecentActivity(
      users,
      ideas,
    );

    const userGrowthData: GrowthData[] = generateGrowthData(users);
    const ideaGrowthData: GrowthData[] = generateGrowthData(ideas);

    const stats: DashboardStats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalIdeas,
      publishedIdeas,
      draftIdeas,
      archivedIdeas,
      adminCount,
      userCount,
      recentActivity,
      userGrowthData,
      ideaGrowthData,
    };

    yield put(getDashboardStatsSuccess(stats));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load dashboard stats";

    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;

    yield put(getDashboardStatsFailure(apiMessage));
  }
}

function* handleRefreshDashboard(): SagaIterator {
  try {
    const [usersResponse, ideasResponse, statsResponse]: [
      UsersResponse,
      IdeasResponse,
      StatsResponse,
    ] = yield call(Promise.all, [
      authService.allUsers({ page: 1, limit: 1000 }),
      ideaService.getAllIdeas({ page: 1, limit: 1000 }),
      authService.userStats(),
    ]);

    // Process data
    const users = usersResponse.data?.users || [];
    const totalUsers = users.length;
    const activeUsers = users.filter((u: User) => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    const adminCount = users.filter((u: User) => u.role === "admin").length;
    const userCount = users.filter((u: User) => u.role === "user").length;

    const ideas = ideasResponse.data?.ideas || [];
    const totalIdeas = ideas.length;
    const publishedIdeas = ideas.filter(
      (i: any) => i.status === "published",
    ).length;
    const draftIdeas = ideas.filter((i: any) => i.status === "draft").length;
    const archivedIdeas = ideas.filter(
      (i: any) => i.status === "archived",
    ).length;

    const recentActivity: RecentActivity[] = generateRecentActivity(
      users,
      ideas,
    );
    const userGrowthData: GrowthData[] = generateGrowthData(users);
    const ideaGrowthData: GrowthData[] = generateGrowthData(ideas);

    const stats: DashboardStats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalIdeas,
      publishedIdeas,
      draftIdeas,
      archivedIdeas,
      adminCount,
      userCount,
      recentActivity,
      userGrowthData,
      ideaGrowthData,
    };

    yield put(refreshDashboardSuccess(stats));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to refresh dashboard";

    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;

    yield put(refreshDashboardFailure(apiMessage));
  }
}

function generateRecentActivity(users: User[], ideas: any[]): RecentActivity[] {
  const activities: RecentActivity[] = [];

  users.forEach((user) => {
    if (user.createdAt) {
      activities.push({
        id: `user-${user._id}`,
        type: "user",
        action: "created",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        timestamp: user.createdAt.toISOString(),
        details: `User ${user.name} registered`,
      });
    }
  });

  // Add idea activities
  ideas.forEach((idea) => {
    if (idea.createdAt) {
      const ownerName =
        typeof idea.owner === "object" && idea.owner !== null
          ? idea.owner.name
          : "Unknown";
      const ownerId =
        typeof idea.owner === "object" && idea.owner !== null
          ? idea.owner._id
          : idea.owner;
      const ownerEmail =
        typeof idea.owner === "object" && idea.owner !== null
          ? idea.owner.email
          : "";

      activities.push({
        id: `idea-${idea._id}`,
        type: "idea",
        action: "created",
        user: {
          id: ownerId,
          name: ownerName,
          email: ownerEmail,
        },
        timestamp: idea.createdAt,
        details: `Idea "${idea.title}" was created`,
      });
    }
  });

  // Sort by timestamp and get latest 10
  return activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 10);
}

function generateGrowthData(items: any[]): GrowthData[] {
  const dateMap = new Map<string, number>();

  items.forEach((item) => {
    if (item.createdAt) {
      const date = new Date(item.createdAt).toISOString().split("T")[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    }
  });

  // Sort dates and create cumulative data
  const sortedDates = Array.from(dateMap.keys()).sort();
  let cumulative = 0;

  return sortedDates.map((date) => {
    cumulative += dateMap.get(date) || 0;
    return { date, count: cumulative };
  });
}

// User Management Sagas
function* handleFetchUsers(
  action: PayloadAction<{ page?: number; limit?: number; search?: string }>,
): SagaIterator {
  try {
    const response: Awaited<ReturnType<typeof authService.allUsers>> =
      yield call(authService.allUsers, action.payload);

    yield put(
      fetchUsersSuccess({
        users: response.data.users,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
      }),
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;
    yield put(fetchUsersFailure(apiMessage));
  }
}

function* handleCreateUser(
  action: PayloadAction<{
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  }>,
): SagaIterator {
  try {
    const response: Awaited<ReturnType<typeof authService.register>> =
      yield call(authService.register, action.payload);

    yield put(createUserSuccess(response.data.user));
    // Refresh users list
    yield put(fetchUsersRequest({ page: 1, limit: 1000 }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create user";
    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;
    yield put(createUserFailure(apiMessage));
  }
}

function* handleUpdateUser(
  action: PayloadAction<{ id: string; data: UpdateUserData }>,
): SagaIterator {
  try {
    const response: Awaited<ReturnType<typeof authService.editUser>> =
      yield call(authService.editUser, action.payload.id, action.payload.data);

    yield put(updateUserSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update user";
    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;
    yield put(updateUserFailure(apiMessage));
  }
}

function* handleDeleteUser(action: PayloadAction<string>): SagaIterator {
  try {
    yield call(authService.deleteUser, action.payload);
    yield put(deleteUserSuccess(action.payload));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete user";
    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;
    yield put(deleteUserFailure(apiMessage));
  }
}

function* handleToggleUserStatus(action: PayloadAction<string>): SagaIterator {
  try {
    const response: Awaited<ReturnType<typeof authService.activateUser>> =
      yield call(authService.activateUser, action.payload);

    yield put(toggleUserStatusSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to toggle user status";
    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;
    yield put(toggleUserStatusFailure(apiMessage));
  }
}

// Idea Management Sagas
function* handleFetchIdeas(
  action: PayloadAction<{
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }>,
): SagaIterator {
  try {
    const response: Awaited<ReturnType<typeof ideaService.getAllIdeas>> =
      yield call(ideaService.getAllIdeas, action.payload);

    yield put(
      fetchIdeasSuccess({
        ideas: response.data.ideas as any,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
      }),
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch ideas";
    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;
    yield put(fetchIdeasFailure(apiMessage));
  }
}

function* handleUpdateIdeaStatus(
  action: PayloadAction<{
    id: string;
    status: "draft" | "published" | "archived";
  }>,
): SagaIterator {
  try {
    const response: Awaited<ReturnType<typeof ideaService.updateIdea>> =
      yield call(ideaService.updateIdea, action.payload.id, {
        status: action.payload.status,
      });

    yield put(updateIdeaStatusSuccess(response.data as any));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update idea status";
    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;
    yield put(updateIdeaStatusFailure(apiMessage));
  }
}

function* handleDeleteIdea(action: PayloadAction<string>): SagaIterator {
  try {
    yield call(ideaService.deleteIdea, action.payload);
    yield put(deleteIdeaSuccess(action.payload));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete idea";
    const axiosError = error as any;
    const apiMessage = axiosError.response?.data?.message || errorMessage;
    yield put(deleteIdeaFailure(apiMessage));
  }
}

// Saga watcher with proper typing
export function* adminDashboardSaga(): SagaIterator {
  yield all([
    // Dashboard stats
    takeLatest(getDashboardStatsRequest.type, handleGetDashboardStats),
    takeLatest(refreshDashboardRequest.type, handleRefreshDashboard),
    // User management
    takeLatest(fetchUsersRequest.type, handleFetchUsers),
    takeLatest(createUserRequest.type, handleCreateUser),
    takeLatest(updateUserRequest.type, handleUpdateUser),
    takeLatest(deleteUserRequest.type, handleDeleteUser),
    takeLatest(toggleUserStatusRequest.type, handleToggleUserStatus),
    // Idea management
    takeLatest(fetchIdeasRequest.type, handleFetchIdeas),
    takeLatest(updateIdeaStatusRequest.type, handleUpdateIdeaStatus),
    takeLatest(deleteIdeaRequest.type, handleDeleteIdea),
  ]);
}
