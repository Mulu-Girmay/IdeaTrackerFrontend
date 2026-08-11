import {
  useInjectReducer,
  useInjectSaga,
} from "../../store/utils/redux-injector";
import ideaReducer, { ideaSliceName } from "../pages/ideaPage/slice/slice";
import { ideaSaga } from "../pages/ideaPage/slice/saga";

export const useInjectUserDashboardModule = () => {
  useInjectReducer({
    key: ideaSliceName as any,
    reducer: ideaReducer,
  });

  useInjectSaga({
    key: ideaSliceName,
    saga: ideaSaga,
    mode: "daemon",
  });
};
