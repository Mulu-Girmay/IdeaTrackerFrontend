import {
  useInjectReducer,
  useInjectSaga,
} from "../../store/utils/redux-injector";
import ideaReducer, { ideaSliceName } from "../pages/ideaPage/slice/slice";
import { ideaSaga } from "../pages/ideaPage/slice/saga";

export const useInjectUserDashboardModule = () => {
  // Inject idea reducer (used in user dashboard for managing ideas)
  useInjectReducer({
    key: ideaSliceName as any,
    reducer: ideaReducer,
  });

  // Inject idea saga
  useInjectSaga({
    key: ideaSliceName,
    saga: ideaSaga,
    mode: "daemon",
  });
};
