// src/store/utils/toolkit.ts
import { createSlice, CreateSliceOptions, Slice } from "@reduxjs/toolkit";

/**
 * Typed wrapper around redux-toolkit's createSlice
 * Provides better type inference for the state
 */
export function createTypedSlice<
  State,
  CaseReducers,
  Name extends string = string,
>(
  options: CreateSliceOptions<State, CaseReducers, Name>,
): Slice<State, CaseReducers, Name> {
  return createSlice(options);
}

export default createTypedSlice;
