// // src/store/idea/saga/index.ts
// import { call, put, takeLatest } from "redux-saga/effects";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import type { SagaIterator } from "redux-saga";
// import { ideaService } from "../../../Config/services/idea.service";
// import {
//   createIdeaRequest,
//   createIdeaSuccess,
//   createIdeaFailure,
//   getMyIdeasRequest,
//   getMyIdeasSuccess,
//   getMyIdeasFailure,
//   getAllIdeasRequest,
//   getAllIdeasSuccess,
//   getAllIdeasFailure,
//   getIdeaByIdRequest,
//   getIdeaByIdSuccess,
//   getIdeaByIdFailure,
//   updateIdeaRequest,
//   updateIdeaSuccess,
//   updateIdeaFailure,
//   deleteIdeaRequest,
//   deleteIdeaSuccess,
//   deleteIdeaFailure,
// } from "./index";
// import type { CreateIdeaData, UpdateIdeaData } from "../../../types/idea.types";

// function* handleCreateIdea(action: PayloadAction<CreateIdeaData>): SagaIterator {
//   try {
//     const response = yield call([ideaService, "createIdea"], action.payload);
//     if (response.success) {
//       yield put(createIdeaSuccess(response.data));
//     } else {
//       yield put(createIdeaFailure(response.message || "Failed to create idea"));
//     }
//   } catch (error: any) {
//     yield put(
//       createIdeaFailure(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to create idea",
//       ),
//     );
//   }
// }

// function* handleGetMyIdeas(
//   action: PayloadAction<{
//     page?: number;
//     limit?: number;
//     status?: string;
//     category?: string;
//   }>,
// ): SagaIterator {
//   try {
//     const response = yield call([ideaService, "getMyIdeas"], action.payload);
//     if (response.success) {
//       yield put(
//         getMyIdeasSuccess({
//           ideas: response.data.ideas,
//           pagination: response.data.pagination,
//         }),
//       );
//     } else {
//       yield put(getMyIdeasFailure(response.message || "Failed to fetch ideas"));
//     }
//   } catch (error: any) {
//     yield put(
//       getMyIdeasFailure(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch ideas",
//       ),
//     );
//   }
// }

// function* handleGetAllIdeas(
//   action: PayloadAction<{
//     page?: number;
//     limit?: number;
//     status?: string;
//     category?: string;
//     search?: string;
//   }>,
// ): SagaIterator {
//   try {
//     const response = yield call([ideaService, "getAllIdeas"], action.payload);
//     if (response.success) {
//       yield put(
//         getAllIdeasSuccess({
//           ideas: response.data.ideas,
//           pagination: response.data.pagination,
//         }),
//       );
//     } else {
//       yield put(
//         getAllIdeasFailure(response.message || "Failed to fetch ideas"),
//       );
//     }
//   } catch (error: any) {
//     yield put(
//       getAllIdeasFailure(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch ideas",
//       ),
//     );
//   }
// }

// function* handleGetIdeaById(action: PayloadAction<string>): SagaIterator {
//   try {
//     const response = yield call([ideaService, "getIdeaById"], action.payload);
//     if (response.success) {
//       yield put(getIdeaByIdSuccess(response.data));
//     } else {
//       yield put(getIdeaByIdFailure(response.message || "Failed to fetch idea"));
//     }
//   } catch (error: any) {
//     yield put(
//       getIdeaByIdFailure(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch idea",
//       ),
//     );
//   }
// }

// function* handleUpdateIdea(
//   action: PayloadAction<{ id: string; data: UpdateIdeaData }>,
// ): SagaIterator {
//   try {
//     const response = yield call(
//       [ideaService, "updateIdea"],
//       action.payload.id,
//       action.payload.data,
//     );
//     if (response.success) {
//       yield put(updateIdeaSuccess(response.data));
//     } else {
//       yield put(updateIdeaFailure(response.message || "Failed to update idea"));
//     }
//   } catch (error: any) {
//     yield put(
//       updateIdeaFailure(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update idea",
//       ),
//     );
//   }
// }

// function* handleDeleteIdea(action: PayloadAction<string>): SagaIterator {
//   try {
//     const response = yield call([ideaService, "deleteIdea"], action.payload);
//     if (response.success) {
//       yield put(deleteIdeaSuccess(action.payload));
//     } else {
//       yield put(deleteIdeaFailure(response.message || "Failed to delete idea"));
//     }
//   } catch (error: any) {
//     yield put(
//       deleteIdeaFailure(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to delete idea",
//       ),
//     );
//   }
// }

// export function* ideaSaga(): SagaIterator {
//   yield takeLatest(createIdeaRequest.type, handleCreateIdea);
//   yield takeLatest(getMyIdeasRequest.type, handleGetMyIdeas);
//   yield takeLatest(getAllIdeasRequest.type, handleGetAllIdeas);
//   yield takeLatest(getIdeaByIdRequest.type, handleGetIdeaById);
//   yield takeLatest(updateIdeaRequest.type, handleUpdateIdea);
//   yield takeLatest(deleteIdeaRequest.type, handleDeleteIdea);
// }
