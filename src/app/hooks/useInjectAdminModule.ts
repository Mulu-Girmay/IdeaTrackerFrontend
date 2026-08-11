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
  useInjectReducer({
    key: adminDashboardSliceName as any,
    reducer: adminDashboardReducer,
  });

  useInjectReducer({
    key: userManagementSliceName as any,
    reducer: userManagementReducer,
  });

  useInjectReducer({
    key: ideaManagementSliceName as any,
    reducer: ideaManagementReducer,
  });

  useInjectSaga({
    key: adminDashboardSliceName,
    saga: adminDashboardSaga,
    mode: "daemon",
  });
};
