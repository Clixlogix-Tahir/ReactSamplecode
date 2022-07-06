import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import appManagementSlice from '../pages/app-management/appManagementSlice';
import gameConfigForm from '../pages/game-config/gameConfigSlice';
import eventSlice from '../pages/events/eventSlice';
import globalSlice from './globalSlice';
import userSlice from '../pages/user-accounts/userSlice';
import teamAccessControlSlice from "../pages/team-access-control-management/teamAccessControlSlice";
import challengesSlice from '../pages/challenges/challenges-slice';
import requestControlSlice from "../pages/request/requestControlSlice";
import customThemeControlslice from "../pages/CustomTheme/customThemeControlslice";

const rootReducer = combineReducers({
  appManagementSlice,
  globalSlice,
  gameConfigForm,
  eventSlice,
  userSlice,
  teamAccessControlSlice,
  challengesSlice,
  requestControlSlice,
  customThemeControlslice,
});

const Store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof Store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export default Store;
