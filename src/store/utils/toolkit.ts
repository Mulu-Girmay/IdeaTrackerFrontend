// src/store/utils/toolkit.ts
import { createSlice } from "@reduxjs/toolkit";
import type { CreateSliceOptions, Slice } from "@reduxjs/toolkit";

/**
 * Typed wrapper around redux-toolkit's createSlice
 * Provides better type inference for the state
 */
export function createTypedSlice<
  State,
  CaseReducers extends import("@reduxjs/toolkit").SliceCaseReducers<State>,
  Name extends string = string,
>(
  options: CreateSliceOptions<State, CaseReducers, Name>,
): Slice<State, CaseReducers, Name> {
  return createSlice(options as any) as any;
}

export default createTypedSlice;
