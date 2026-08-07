import type { Reducer, Store } from "@reduxjs/toolkit";
import type { Saga } from "redux-saga";
import type { RootState } from "./RootState";

export interface InjectedReducer {
  key: keyof RootState;
  reducer: Reducer;
}

export interface InjectedSaga {
  key: string;
  saga: Saga;
  mode?: "once" | "daemon" | "restartable";
}

export interface ReducerManager {
  getReducerMap: () => Record<string, Reducer>;
  reduce: (state: any, action: any) => any;
  add: (key: string, reducer: Reducer) => void;
  remove: (key: string) => void;
}

export interface StoreWithReducerManager extends Store {
  reducerManager: ReducerManager;
}
