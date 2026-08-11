import {
  useInjectReducer,
  useInjectSaga,
} from "../../store/utils/redux-injector";
import {
  adminDashboardSliceName,
  adminDashboardReducer,
  userManagementSliceName,
  userManagementReducer,
  ideaManagementSliceName,
  ideaManagementReducer,
} from "../pages/AdmiPage/slice";
import { adminDashboardSaga } from "../pages/AdmiPage/slice/saga";

export const useInjectAdminModule = () => {
  // Inject admin dashboard reducer
  useInjectReducer({
    key: adminDashboardSliceName as any,
    reducer: adminDashboardReducer,
  });

  // Inject user management reducer
  useInjectReducer({
    key: userManagementSliceName as any,
    reducer: userManagementReducer,
  });

  // Inject idea management reducer
  useInjectReducer({
    key: ideaManagementSliceName as any,
    reducer: ideaManagementReducer,
  });

  // Inject all admin sagas (includes dashboard, user, and idea management)
  useInjectSaga({
    key: adminDashboardSliceName,
    saga: adminDashboardSaga,
    mode: "daemon",
  });
};
