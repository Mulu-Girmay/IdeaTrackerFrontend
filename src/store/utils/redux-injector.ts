// src/store/utils/redux-injectors.ts
import { useDispatch, useSelector, useStore } from "react-redux";
import type { Saga } from "redux-saga";
import type { Reducer } from "@reduxjs/toolkit";
import type { RootState } from "../types/RootState";
import type { StoreWithReducerManager } from "../types/types";
import { useInjectReducer as useInjectReducerBase } from "redux-injectors";
import { useInjectSaga as useInjectSagaBase } from "redux-injectors";
import type { AppDispatch } from "../configureStore";

// Typed hooks for the store
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector<RootState, T>(selector);
export const useAppStore = () => useStore<RootState>();

/**
 * Wrapper around useInjectReducer with typed state
 */
export const useInjectReducer = (params: {
  key: keyof RootState;
  reducer: Reducer;
}) => {
  return useInjectReducerBase({
    key: params.key as string,
    reducer: params.reducer,
  });
};

/**
 * Wrapper around useInjectSaga with typed options
 */
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

/**
 * Check if reducer has been injected
 */
export const isReducerInjected = (key: keyof RootState): boolean => {
  const store = useStore() as StoreWithReducerManager;
  return store.reducerManager.getReducerMap().hasOwnProperty(key);
};
