import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootReducer, reducerManager } from "./reducer";
import type { StoreWithReducerManager } from "./types/types";
import rootSaga from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(middlewares as any),
  devTools: import.meta.env.NODE_ENV !== "production",
}) as StoreWithReducerManager;

store.reducerManager = reducerManager;

(store as any).runSaga = sagaMiddleware.run;

sagaMiddleware.run(rootSaga);

if (import.meta.hot) {
  import.meta.hot.accept("./reducer", async () => {
    const newReducerModule = await import("./reducer");
    store.replaceReducer(newReducerModule.reducerManager.reduce);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
