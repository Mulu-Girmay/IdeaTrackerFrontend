// src/store/types/types.ts
import { Reducer, Store } from "@reduxjs/toolkit";
import { Saga } from "redux-saga";
import { RootState } from "./RootState";

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
