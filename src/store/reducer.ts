import { combineReducers } from "@reduxjs/toolkit";
import type { Reducer, UnknownAction } from "@reduxjs/toolkit";
import type { ReducerManager } from "./types/types";
import type { RootState } from "./types/RootState";

import authReducer from "../app/pages/authPage/slice/slice";
import { authSliceName } from "../app/pages/authPage/slice/slice";
import forgotPasswordReducer from "../app/pages/ForgotPasswordPage/slice/slice";
import { forgotPasswordSliceName } from "../app/pages/ForgotPasswordPage/slice/slice";
import resetPasswordReducer from "../app/pages/ResetPage/slice/slice";
import { resetPasswordSliceName } from "../app/pages/ResetPage/slice/slice";


const initialReducers: Record<string, Reducer> = {
  [authSliceName]: authReducer,
  [forgotPasswordSliceName]: forgotPasswordReducer,
  [resetPasswordSliceName]: resetPasswordReducer,
};

export function createReducerManager(
  initialReducers: Record<string, Reducer>,
): ReducerManager {
  const reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);
  let keysToRemove: string[] = [];
  return {
    getReducerMap: () => reducers,

    reduce: (state: RootState, action: UnknownAction) => {
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (const key of keysToRemove) {
          delete (state as any)[key];
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
