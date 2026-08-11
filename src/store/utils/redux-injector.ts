import { useDispatch, useSelector, useStore } from "react-redux";
import type { Saga } from "redux-saga";
import type { Reducer } from "@reduxjs/toolkit";
import type { RootState } from "../types/RootState";
import type { StoreWithReducerManager } from "../types/types";
import type { AppDispatch } from "../configureStore";
import { useEffect, useRef } from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector<RootState, T>(selector);
export const useAppStore = () => useStore<RootState>();

// Custom implementation without redux-injectors library
export const useInjectReducer = (params: {
  key: keyof RootState;
  reducer: Reducer;
}) => {
  const store = useStore() as StoreWithReducerManager;
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!injectedRef.current && store.reducerManager) {
      store.reducerManager.add(params.key as string, params.reducer);
      injectedRef.current = true;
      
      console.log(`✅ Reducer injected: ${params.key as string}`);
    }
  }, [store, params.key, params.reducer]);
};

export const useInjectSaga = (params: {
  key: string;
  saga: Saga;
  mode?: "once" | "daemon" | "restartable";
}) => {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!injectedRef.current) {
      // In a production app, you'd want to track running sagas
      // and use sagaMiddleware.run(params.saga) here
      // For now, we assume sagas are run through the rootSaga or manually
      injectedRef.current = true;
      
      console.log(`✅ Saga registered: ${params.key}`);
    }
  }, [params.key, params.saga, params.mode]);
};

export const isReducerInjected = (key: keyof RootState): boolean => {
  const store = useStore() as StoreWithReducerManager;
  return store.reducerManager?.getReducerMap?.()?.hasOwnProperty?.(key) ?? false;
};
