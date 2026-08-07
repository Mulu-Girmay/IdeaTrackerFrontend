import { useDispatch, useSelector, useStore } from "react-redux";
import type { Saga } from "redux-saga";
import type { Reducer } from "@reduxjs/toolkit";
import type { RootState } from "../types/RootState";
import type { StoreWithReducerManager } from "../types/types";
import { useInjectReducer as useInjectReducerBase } from "redux-injectors";
import { useInjectSaga as useInjectSagaBase } from "redux-injectors";
import type { AppDispatch } from "../configureStore";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector<RootState, T>(selector);
export const useAppStore = () => useStore<RootState>();

export const useInjectReducer = (params: {
  key: keyof RootState;
  reducer: Reducer;
}) => {
  return useInjectReducerBase({
    key: params.key as string,
    reducer: params.reducer,
  });
};

export const useInjectSaga = (params: {
  key: string;
  saga: Saga;
  mode?: "once" | "daemon" | "restartable";
}) => {
  return useInjectSagaBase({
    key: params.key,
    saga: params.saga,
    mode: params.mode || "daemon",
  } as any);
};

export const isReducerInjected = (key: keyof RootState): boolean => {
  const store = useStore() as StoreWithReducerManager;
  return store.reducerManager.getReducerMap().hasOwnProperty(key);
};
