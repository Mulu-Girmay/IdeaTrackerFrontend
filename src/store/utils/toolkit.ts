import { createSlice } from "@reduxjs/toolkit";
import type { CreateSliceOptions, Slice } from "@reduxjs/toolkit";
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
