// src/store/reducers.ts
import { combineReducers, Reducer, AnyAction } from "@reduxjs/toolkit";
import { ReducerManager } from "./types/types";
import { RootState } from "./types/RootState";

import authReducer from "./slices/authSlice";
import { authSliceName } from "./slices/authSlice";

const initialReducers: Record<string, Reducer> = {
  [authSliceName]: authReducer,
};

export function createReducerManager(
  initialReducers: Record<string, Reducer>,
): ReducerManager {
  const reducers = { ...initialReducers };

  let combinedReducer = combineReducers(reducers);

  let keysToRemove: string[] = [];

  return {
    getReducerMap: () => reducers,

    reduce: (state: RootState, action: AnyAction) => {
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (const key of keysToRemove) {
          delete state[key];
        }
        keysToRemove = [];
      }

      return combinedReducer(state, action);
    },

    add: (key: string, reducer: Reducer) => {
      if (!key || reducers[key]) {
        return;
      }

      reducers[key] = reducer;

      combinedReducer = combineReducers(reducers);
    },

    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return;
      }

      delete reducers[key];

      keysToRemove.push(key);

      combinedReducer = combineReducers(reducers);
    },
  };
}

export const reducerManager = createReducerManager(initialReducers);

export const rootReducer = reducerManager.reduce;
