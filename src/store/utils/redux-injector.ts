// src/store/utils/redux-injectors.ts
import { useDispatch, useSelector, useStore } from "react-redux";
import { Saga } from "redux-saga";
import { Reducer } from "@reduxjs/toolkit";
import { RootState } from "../types/RootState";
import { StoreWithReducerManager } from "../types/types";
import { useInjectReducer as useInjectReducerBase } from "redux-injectors";
import { useInjectSaga as useInjectSagaBase } from "redux-injectors";
import { compose } from "redux";

// Typed hooks for the store
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector<RootState, T>(selector);
export const useAppStore = () => useStore<RootState>();

// Need to declare these types
declare type AppDispatch = any; // Will be defined when we create the store

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
  });
};

/**
 * Check if reducer has been injected
 */
export const isReducerInjected = (key: keyof RootState): boolean => {
  const store = useStore() as StoreWithReducerManager;
  return store.reducerManager.getReducerMap().hasOwnProperty(key);
};
