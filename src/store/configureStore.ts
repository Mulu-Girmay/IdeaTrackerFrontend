// src/store/configureStore.ts
import {
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { reduxBatch } from "@manaflair/redux-batch";
import { rootReducer, reducerManager } from "./reducers";
import { StoreWithReducerManager } from "./types/types";
import rootSaga from "./sagas/rootSaga";
import { logger } from "redux-logger";

const sagaMiddleware = createSagaMiddleware();

=const middlewares: Middleware[] = [sagaMiddleware];

if (import.meta.env.NODE_ENV === "development") {
  middlewares.push(logger as Middleware);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, 
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(middlewares),
  devTools: import.meta.env.NODE_ENV !== "production",
  enhancers: [reduxBatch],
}) as StoreWithReducerManager;

store.reducerManager = reducerManager;

sagaMiddleware.run(rootSaga);

if (import.meta.hot) {
  import.meta.hot.accept("./reducers", () => {
    const newReducerManager = require("./reducers").reducerManager;
    store.replaceReducer(newReducerManager.reduce);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
