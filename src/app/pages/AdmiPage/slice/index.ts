// Export all admin-related slices, selectors, and sagas
export * from "./slice";
export * from "./selector";
export * from "./saga";
export * from "./userManagementSlice";
export * from "./userManagementSelector";
export * from "./ideaManagementSlice";
export * from "./ideaManagementSelector";

export { adminDashboardReducer } from "./slice";
export { userManagementReducer } from "./userManagementSlice";
export { ideaManagementReducer } from "./ideaManagementSlice";

export { adminDashboardSliceName } from "./slice";
export { userManagementSliceName } from "./userManagementSlice";
export { ideaManagementSliceName } from "./ideaManagementSlice";
