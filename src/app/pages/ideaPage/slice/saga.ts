import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { ideaService } from "../../../Config/services/idea.service";
import { getErrorMessage } from "../../../Config/utils/getErrorMessage";
import {
  createIdeaRequest,
  createIdeaSuccess,
  createIdeaFailure,
  getMyIdeasRequest,
  getMyIdeasSuccess,
  getMyIdeasFailure,
  getAllIdeasRequest,
  getAllIdeasSuccess,
  getAllIdeasFailure,
  getIdeaByIdRequest,
  getIdeaByIdSuccess,
  getIdeaByIdFailure,
  updateIdeaRequest,
  updateIdeaSuccess,
  updateIdeaFailure,
  deleteIdeaRequest,
  deleteIdeaSuccess,
  deleteIdeaFailure,
} from "./slice";
import type { CreateIdeaData, UpdateIdeaData } from "../../../types/idea.types";

function* handleCreateIdea(
  action: PayloadAction<CreateIdeaData>,
): SagaIterator {
  try {
    const response = yield call([ideaService, "createIdea"], action.payload);
    if (response.success) {
      yield put(createIdeaSuccess(response.data));
    } else {
      yield put(createIdeaFailure(response.message || "Failed to create idea"));
    }
  } catch (error: any) {
    yield put(
      createIdeaFailure(
        getErrorMessage(error, "We couldn't save your idea. Please try again."),
      ),
    );
  }
}

function* handleGetMyIdeas(
  action: PayloadAction<{
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }>,
): SagaIterator {
  try {
    const response = yield call([ideaService, "getMyIdeas"], action.payload);
    if (response.success) {
      yield put(
        getMyIdeasSuccess({
          ideas: response.data.ideas,
          pagination: response.data.pagination,
        }),
      );
    } else {
      yield put(getMyIdeasFailure(response.message || "Failed to fetch ideas"));
    }
  } catch (error: any) {
    yield put(
      getMyIdeasFailure(
        getErrorMessage(
          error,
          "We couldn't load your ideas. Please try again.",
        ),
      ),
    );
  }
}

function* handleGetAllIdeas(
  action: PayloadAction<{
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }>,
): SagaIterator {
  try {
    const response = yield call([ideaService, "getAllIdeas"], action.payload);
    if (response.success) {
      yield put(
        getAllIdeasSuccess({
          ideas: response.data.ideas,
          pagination: response.data.pagination,
        }),
      );
    } else {
      yield put(
        getAllIdeasFailure(response.message || "Failed to fetch ideas"),
      );
    }
  } catch (error: any) {
    yield put(
      getAllIdeasFailure(
        getErrorMessage(error, "We couldn't load ideas. Please try again."),
      ),
    );
  }
}

function* handleGetIdeaById(action: PayloadAction<string>): SagaIterator {
  try {
    const response = yield call([ideaService, "getIdeaById"], action.payload);
    if (response.success) {
      yield put(getIdeaByIdSuccess(response.data));
    } else {
      yield put(getIdeaByIdFailure(response.message || "Failed to fetch idea"));
    }
  } catch (error: any) {
    yield put(
      getIdeaByIdFailure(
        getErrorMessage(error, "We couldn't load this idea. Please try again."),
      ),
    );
  }
}

function* handleUpdateIdea(
  action: PayloadAction<{ id: string; data: UpdateIdeaData }>,
): SagaIterator {
  try {
    const response = yield call(
      [ideaService, "updateIdea"],
      action.payload.id,
      action.payload.data,
    );
    if (response.success) {
      yield put(updateIdeaSuccess(response.data));
    } else {
      yield put(updateIdeaFailure(response.message || "Failed to update idea"));
    }
  } catch (error: any) {
    yield put(
      updateIdeaFailure(
        getErrorMessage(
          error,
          "We couldn't update your idea. Please try again.",
        ),
      ),
    );
  }
}

function* handleDeleteIdea(action: PayloadAction<string>): SagaIterator {
  try {
    const response = yield call([ideaService, "deleteIdea"], action.payload);
    if (response.success) {
      yield put(deleteIdeaSuccess(action.payload));
    } else {
      yield put(deleteIdeaFailure(response.message || "Failed to delete idea"));
    }
  } catch (error: any) {
    yield put(
      deleteIdeaFailure(
        getErrorMessage(
          error,
          "We couldn't delete your idea. Please try again.",
        ),
      ),
    );
  }
}

export function* ideaSaga(): SagaIterator {
  yield takeLatest(createIdeaRequest.type, handleCreateIdea);
  yield takeLatest(getMyIdeasRequest.type, handleGetMyIdeas);
  yield takeLatest(getAllIdeasRequest.type, handleGetAllIdeas);
  yield takeLatest(getIdeaByIdRequest.type, handleGetIdeaById);
  yield takeLatest(updateIdeaRequest.type, handleUpdateIdea);
  yield takeLatest(deleteIdeaRequest.type, handleDeleteIdea);
}
